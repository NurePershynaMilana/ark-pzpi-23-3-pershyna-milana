import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { SensorData, Sensor, Plant, PlantType } from '../models';
import { ApiResponse } from '../types';


interface DeviceCommand {
  device_type: 'watering' | 'lighting' | 'ventilation' | 'heating';
  action: 'start' | 'stop' | 'adjust';
  value?: number;
  duration?: number; 
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
}

interface AnalysisResult {
  plant_id: number;
  plant_name: string;
  plant_type: string;
  current_conditions: {
    humidity?: number;
    temperature?: number;
    light?: number;
  };
  optimal_conditions: {
    humidity: number;
    temperature: number;
    light: number;
    watering_frequency: number;
  };
  deviations: {
    humidity_deviation?: number;
    temperature_deviation?: number;
    light_deviation?: number;
  };
  recommendations: DeviceCommand[];
  overall_status: 'healthy' | 'needs_attention' | 'critical';
}

// POST /api/sensors/analyze 
export const analyzeSensorData = async (req: Request, res: Response) => {
  try {
    const { hardware_ids } = req.body;
    
    if (!hardware_ids || !Array.isArray(hardware_ids)) {
      return res.status(400).json({
        success: false,
        error: 'Hardware IDs array is required'
      });
    }

    const analysisResults: AnalysisResult[] = [];
    
    const sensors = await Sensor.findAll({
      where: { 
        hardware_id: { [Op.in]: hardware_ids },
        is_active: true 
      },
      include: [
        {
          model: Plant,
          as: 'plant',
          required: true,
          include: [
            {
              model: PlantType,
              as: 'plantType',
              required: true
            }
          ]
        }
      ]
    });
    
    if (sensors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No active sensors found with provided hardware IDs'
      });
    }

    const plantSensors = new Map();
    sensors.forEach((sensor: any) => {
      const plantId = sensor.plant_id;
      const plant = sensor.plant;
      
      if (!plantSensors.has(plantId)) {
        plantSensors.set(plantId, {
          plant: plant,
          sensors: []
        });
      }
      plantSensors.get(plantId).sensors.push(sensor);
    });


    for (const [plantId, { plant, sensors }] of plantSensors) {
      
      if (!plant) {
        console.log(`Skipping plant ${plantId} - missing plant data`);
        continue;
      }


      let plantType = plant.plantType;
      if (!plantType && plant.plant_type_id) {
        plantType = await PlantType.findByPk(plant.plant_type_id);
      }

      if (!plantType) {
        console.log(`Skipping plant ${plantId} - missing plantType data`);
        continue;
      }
      
      const currentConditions: any = {};
      const sensorPromises = sensors.map(async (sensor: any) => {
        const latestData = await SensorData.findOne({
          where: { sensor_id: sensor.sensor_id },
          order: [['timestamp', 'DESC']]
        });
        
        if (latestData) {
          currentConditions[sensor.sensor_type] = latestData.value;
        }
      });

      await Promise.all(sensorPromises);

      const optimalConditions = {
        humidity: plantType?.optimal_humidity || 0,
        temperature: plantType?.optimal_temperature || 0,
        light: plantType?.optimal_light || 0,
        watering_frequency: plantType?.watering_frequency || 0
      };

      const deviations: any = {};
      const recommendations: DeviceCommand[] = [];

      if (currentConditions.humidity !== undefined) {
        const humidityDev = currentConditions.humidity - optimalConditions.humidity;
        deviations.humidity_deviation = Math.round(humidityDev * 100) / 100;

        if (humidityDev < -15) {
          recommendations.push({
            device_type: 'watering',
            action: 'start',
            value: 200, // ml water
            duration: 2,
            priority: 'high',
            reason: `Critically low humidity: ${currentConditions.humidity}% (optimal: ${optimalConditions.humidity}%)`
          });
        } else if (humidityDev < -5) {
          recommendations.push({
            device_type: 'watering',
            action: 'start',
            value: 150,
            duration: 1,
            priority: 'medium',
            reason: `Low humidity: ${currentConditions.humidity}% (optimal: ${optimalConditions.humidity}%)`
          });
        } else if (humidityDev > 20) {
          recommendations.push({
            device_type: 'ventilation',
            action: 'start',
            duration: 30,
            priority: 'medium',
            reason: `High humidity: ${currentConditions.humidity}% (optimal: ${optimalConditions.humidity}%)`
          });
        }
      }

      if (currentConditions.temperature !== undefined) {
        const tempDev = currentConditions.temperature - optimalConditions.temperature;
        deviations.temperature_deviation = Math.round(tempDev * 100) / 100;

        if (tempDev < -5) {
          recommendations.push({
            device_type: 'heating',
            action: 'start',
            value: optimalConditions.temperature + 1, // target temperature
            duration: 60,
            priority: 'high',
            reason: `Low temperature: ${currentConditions.temperature}°C (optimal: ${optimalConditions.temperature}°C)`
          });
        } else if (tempDev > 5) {
          recommendations.push({
            device_type: 'ventilation',
            action: 'start',
            duration: 45,
            priority: 'medium',
            reason: `High temperature: ${currentConditions.temperature}°C (optimal: ${optimalConditions.temperature}°C)`
          });
        }
      }


      if (currentConditions.light !== undefined) {
        const lightDev = currentConditions.light - optimalConditions.light;
        deviations.light_deviation = Math.round(lightDev);

        if (lightDev < -3000) {
          recommendations.push({
            device_type: 'lighting',
            action: 'start',
            value: Math.abs(lightDev), // additional light intensity
            duration: 120,
            priority: 'high',
            reason: `Insufficient lighting: ${currentConditions.light} lux (optimal: ${optimalConditions.light} lux)`
          });
        } else if (lightDev < -1000) {
          recommendations.push({
            device_type: 'lighting',
            action: 'start',
            value: Math.abs(lightDev),
            duration: 60,
            priority: 'medium',
            reason: `Low lighting: ${currentConditions.light} lux (optimal: ${optimalConditions.light} lux)`
          });
        }
      }

      let overallStatus: 'healthy' | 'needs_attention' | 'critical' = 'healthy';
      const criticalCount = recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length;
      
      if (criticalCount > 0) {
        overallStatus = 'critical';
      } else if (recommendations.length > 0) {
        overallStatus = 'needs_attention';
      }

      analysisResults.push({
        plant_id: plantId,
        plant_name: plant.name,
        plant_type: plantType.name,
        current_conditions: currentConditions,
        optimal_conditions: optimalConditions,
        deviations,
        recommendations,
        overall_status: overallStatus
      });
    }

    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        analyzed_plants: analysisResults.length,
        results: analysisResults,
        total_recommendations: analysisResults.reduce((sum, r) => sum + r.recommendations.length, 0)
      },
      message: 'Intelligent sensor analysis completed successfully'
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform sensor analysis'
    });
  }
};

// POST /api/sensors/simulate-iot
export const simulateIoTData = async (req: Request, res: Response) => {
  try {
    const { plant_ids } = req.body;
    
    if (!plant_ids || !Array.isArray(plant_ids)) {
      return res.status(400).json({
        success: false,
        error: 'Plant IDs array is required'
      });
    }
    
    const simulatedData = [];
    
    for (const plantId of plant_ids) {
      const sensors = await Sensor.findAll({
        where: { 
          plant_id: plantId,
          is_active: true 
        },
        include: [
          {
            model: Plant,
            as: 'plant',
            include: [
              {
                model: PlantType,
                as: 'plantType'
              }
            ]
          }
        ]
      });

      for (const sensor of sensors) {
        let simulatedValue: number;

        switch (sensor.sensor_type) {
          case 'humidity':
            const optimalHumidity = sensor.plant.plantType.optimal_humidity;
            simulatedValue = optimalHumidity + (Math.random() - 0.4) * 45;
            simulatedValue = Math.max(10, Math.min(95, simulatedValue));
            break;
            
          case 'temperature':
            const optimalTemp = sensor.plant.plantType.optimal_temperature;
            simulatedValue = optimalTemp + (Math.random() - 0.5) * 16;
            simulatedValue = Math.max(5, Math.min(40, simulatedValue));
            break;
            
          case 'light':
            const optimalLight = sensor.plant.plantType.optimal_light;
            simulatedValue = optimalLight + (Math.random() - 0.5) * 10000;
            simulatedValue = Math.max(0, Math.min(50000, simulatedValue));
            break;
            
          default:
            simulatedValue = Math.random() * 100;
        }

        const sensorData = await SensorData.create({
          sensor_id: sensor.sensor_id,
          value: Math.round(simulatedValue * 100) / 100
        });

        simulatedData.push({
          hardware_id: sensor.hardware_id,
          sensor_type: sensor.sensor_type,
          plant_name: sensor.plant.name,
          value: sensorData.value,
          timestamp: sensorData.timestamp
        });
      }
    }

    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        simulated_sensors: simulatedData.length,
        data: simulatedData
      },
      message: 'IoT data simulation completed successfully'
    });

  } catch (error) {
    console.error('❌ IoT simulation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to simulate IoT data'
    });
  }
};