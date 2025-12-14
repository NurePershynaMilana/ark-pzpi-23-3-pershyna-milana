import { Request, Response } from 'express';
import { Sensor, Plant } from '../models';
import { ApiResponse } from '../types';

// GET /api/sensors
export const getAllSensors = async (req: Request, res: Response) => {
  try {
    const sensors = await Sensor.findAll({
      include: [
        {
          model: Plant,
          as: 'plant',
          attributes: ['plant_id', 'name', 'location']
        }
      ]
    });
    
    const response: ApiResponse<typeof sensors> = {
      success: true,
      data: sensors,
      message: 'Sensors retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching sensors:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch sensors'
    };
    res.status(500).json(response);
  }
};

// GET /api/sensors/:id
export const getSensorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sensor = await Sensor.findByPk(id, {
      include: [
        {
          model: Plant,
          as: 'plant',
          attributes: ['plant_id', 'name', 'location']
        }
      ]
    });
    
    if (!sensor) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof sensor> = {
      success: true,
      data: sensor,
      message: 'Sensor retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching sensor:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch sensor'
    };
    res.status(500).json(response);
  }
};

// GET /api/plants/:plantId/sensors
export const getSensorsByPlantId = async (req: Request, res: Response) => {
  try {
    const { plantId } = req.params;
    
    const sensors = await Sensor.findAll({
      where: { plant_id: plantId }
    });
    
    const response: ApiResponse<typeof sensors> = {
      success: true,
      data: sensors,
      message: 'Plant sensors retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching plant sensors:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch plant sensors'
    };
    res.status(500).json(response);
  }
};

// POST /api/sensors
export const createSensor = async (req: Request, res: Response) => {
  try {
    const { plant_id, sensor_type, hardware_id, is_active = true } = req.body;

    const plant = await Plant.findByPk(plant_id);
    if (!plant) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant not found'
      };
      return res.status(400).json(response);
    }

    const existingSensor = await Sensor.findOne({ where: { hardware_id } });
    if (existingSensor) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor with this hardware ID already exists'
      };
      return res.status(400).json(response);
    }
    
    const sensor = await Sensor.create({
      plant_id,
      sensor_type,
      hardware_id,
      is_active
    });

    const createdSensor = await Sensor.findByPk(sensor.sensor_id, {
      include: [
        {
          model: Plant,
          as: 'plant',
          attributes: ['plant_id', 'name', 'location']
        }
      ]
    });
    
    const response: ApiResponse<typeof createdSensor> = {
      success: true,
      data: createdSensor,
      message: 'Sensor created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating sensor:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create sensor'
    };
    res.status(500).json(response);
  }
};

// PUT /api/sensors/:id
export const updateSensor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sensor_type, hardware_id, is_active } = req.body;
    
    const sensor = await Sensor.findByPk(id);
    if (!sensor) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor not found'
      };
      return res.status(404).json(response);
    }

    if (hardware_id && hardware_id !== sensor.hardware_id) {
      const existingSensor = await Sensor.findOne({ where: { hardware_id } });
      if (existingSensor) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Sensor with this hardware ID already exists'
        };
        return res.status(400).json(response);
      }
    }
    
    await sensor.update({
      sensor_type: sensor_type || sensor.sensor_type,
      hardware_id: hardware_id || sensor.hardware_id,
      is_active: is_active !== undefined ? is_active : sensor.is_active
    });

    const updatedSensor = await Sensor.findByPk(id, {
      include: [
        {
          model: Plant,
          as: 'plant',
          attributes: ['plant_id', 'name', 'location']
        }
      ]
    });
    
    const response: ApiResponse<typeof updatedSensor> = {
      success: true,
      data: updatedSensor,
      message: 'Sensor updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error updating sensor:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update sensor'
    };
    res.status(500).json(response);
  }
};

// DELETE /api/sensors/:id
export const deleteSensor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const sensor = await Sensor.findByPk(id);
    if (!sensor) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sensor not found'
      };
      return res.status(404).json(response);
    }
    
    await sensor.destroy();
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Sensor deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error deleting sensor:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete sensor'
    };
    res.status(500).json(response);
  }
};