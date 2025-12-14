import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { SensorData, Sensor, Plant } from '../models';
import { ApiResponse, CreateSensorDataRequest } from '../types';

// GET /api/sensor-data - Получить все данные датчиков
export const getAllSensorData = async (req: Request, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const sensorData = await SensorData.findAll({
      limit: Number(limit),
      offset: Number(offset),
      order: [['timestamp', 'DESC']],
      include: [
        {
          model: Sensor,
          as: 'sensor',
          attributes: ['sensor_id', 'sensor_type', 'hardware_id'],
          include: [
            {
              model: Plant,
              as: 'plant',
              attributes: ['plant_id', 'name', 'location']
            }
          ]
        }
      ]
    });
    
    const response: ApiResponse<typeof sensorData> = {
      success: true,
      data: sensorData,
      message: 'Sensor data retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch sensor data'
    };
    res.status(500).json(response);
  }
};

// GET /api/sensor-data/:id - Получить данные датчика по ID
export const getSensorDataById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sensorData = await SensorData.findByPk(id, {
      include: [
        {
          model: Sensor,
          as: 'sensor',
          include: [
            {
              model: Plant,
              as: 'plant',
              attributes: ['plant_id', 'name', 'location']
            }
          ]
        }
      ]
    });
    
    if (!sensorData) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor data not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof sensorData> = {
      success: true,
      data: sensorData,
      message: 'Sensor data retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch sensor data'
    };
    res.status(500).json(response);
  }
};

// GET /api/sensors/:sensorId/data - Получить данные конкретного датчика
export const getDataBySensorId = async (req: Request, res: Response) => {
  try {
    const { sensorId } = req.params;
    const { limit = 100, offset = 0, from, to } = req.query;
    
    // Формируем условие для фильтрации по времени
    let whereClause: any = { sensor_id: sensorId };
    
    if (from || to) {
      whereClause.timestamp = {};
      if (from) whereClause.timestamp[Op.gte] = new Date(from as string);
      if (to) whereClause.timestamp[Op.lte] = new Date(to as string);
    }
    
    const sensorData = await SensorData.findAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [['timestamp', 'DESC']]
    });
    
    const response: ApiResponse<typeof sensorData> = {
      success: true,
      data: sensorData,
      message: 'Sensor data retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch sensor data'
    };
    res.status(500).json(response);
  }
};

// POST /api/sensor-data - Создать новую запись данных датчика
export const createSensorData = async (req: Request, res: Response) => {
  try {
    const { sensor_id, value }: CreateSensorDataRequest = req.body;
    
    // Проверяем существование датчика
    const sensor = await Sensor.findByPk(sensor_id);
    if (!sensor) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor not found'
      };
      return res.status(400).json(response);
    }
    
    // Проверяем, активен ли датчик
    if (!sensor.is_active) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor is not active'
      };
      return res.status(400).json(response);
    }
    
    const sensorData = await SensorData.create({
      sensor_id,
      value
    });
    
    const response: ApiResponse<typeof sensorData> = {
      success: true,
      data: sensorData,
      message: 'Sensor data created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating sensor data:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create sensor data'
    };
    res.status(500).json(response);
  }
};

// POST /api/sensor-data/bulk - Создать множество записей данных (для IoT)
export const createBulkSensorData = async (req: Request, res: Response) => {
  try {
    const { data } = req.body; // массив объектов {sensor_id, value}
    
    if (!Array.isArray(data) || data.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Data array is required and must not be empty'
      };
      return res.status(400).json(response);
    }
    
    // Проверяем все sensor_id
    const sensorIds = data.map(item => item.sensor_id);
    const sensors = await Sensor.findAll({
      where: { sensor_id: { [Op.in]: sensorIds }, is_active: true }
    });
    
    if (sensors.length !== sensorIds.length) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Some sensors not found or inactive'
      };
      return res.status(400).json(response);
    }
    
    const sensorDataRecords = await SensorData.bulkCreate(data);
    
    const response: ApiResponse<typeof sensorDataRecords> = {
      success: true,
      data: sensorDataRecords,
      message: `${sensorDataRecords.length} sensor data records created successfully`
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating bulk sensor data:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create bulk sensor data'
    };
    res.status(500).json(response);
  }
};

// DELETE /api/sensor-data/:id - Удалить запись данных датчика
export const deleteSensorData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const sensorData = await SensorData.findByPk(id);
    if (!sensorData) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor data not found'
      };
      return res.status(404).json(response);
    }
    
    await sensorData.destroy();
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Sensor data deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error deleting sensor data:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete sensor data'
    };
    res.status(500).json(response);
  }
};