import { Request, Response } from 'express';
import { Plant, PlantType, Sensor } from '../models';
import { ApiResponse, CreatePlantRequest } from '../types';

// GET /api/my-plants - Get current user's plants
export const getMyPlants = async (req: Request, res: Response) => {
  try {
    const userId = req.user.user_id;
    
    const plants = await Plant.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PlantType,
          as: 'plantType',
          attributes: ['plant_type_id', 'name', 'optimal_humidity', 'optimal_temperature', 'optimal_light', 'watering_frequency']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    const response: ApiResponse<typeof plants> = {
      success: true,
      data: plants,
      message: 'Your plants retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching user plants:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch your plants'
    };
    res.status(500).json(response);
  }
};

// GET /api/my-plants/:id - Get specific user's plant
export const getMyPlantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    const plant = await Plant.findOne({
      where: { 
        plant_id: id,
        user_id: userId // Only user's own plants
      },
      include: [
        {
          model: PlantType,
          as: 'plantType'
        },
        {
          model: Sensor,
          as: 'sensors',
          attributes: ['sensor_id', 'sensor_type', 'hardware_id', 'is_active']
        }
      ]
    });
    
    if (!plant) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant not found or access denied'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof plant> = {
      success: true,
      data: plant,
      message: 'Plant retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching plant:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch plant'
    };
    res.status(500).json(response);
  }
};

// POST /api/my-plants - Create new plant for current user
export const createMyPlant = async (req: Request, res: Response) => {
  try {
    const userId = req.user.user_id;
    const { plant_type_id, name, location } = req.body;
    
    // Validation
    if (!plant_type_id || !name || !location) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant type, name and location are required'
      };
      return res.status(400).json(response);
    }
    
    // Check if plant type exists
    const plantType = await PlantType.findByPk(plant_type_id);
    if (!plantType) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant type not found'
      };
      return res.status(400).json(response);
    }
    
    // Create plant with current user as owner
    const plant = await Plant.create({
      user_id: userId,
      plant_type_id,
      name,
      location
    });
    
    // Get created plant with relations
    const createdPlant = await Plant.findByPk(plant.plant_id, {
      include: [
        {
          model: PlantType,
          as: 'plantType'
        }
      ]
    });
    
    const response: ApiResponse<typeof createdPlant> = {
      success: true,
      data: createdPlant,
      message: 'Plant created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating plant:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create plant'
    };
    res.status(500).json(response);
  }
};

// PUT /api/my-plants/:id - Update user's plant
export const updateMyPlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    const { name, location, plant_type_id } = req.body;
    
    // Find plant and verify ownership
    const plant = await Plant.findOne({
      where: { 
        plant_id: id,
        user_id: userId
      }
    });
    
    if (!plant) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant not found or access denied'
      };
      return res.status(404).json(response);
    }
    
    // Validate plant type if updating
    if (plant_type_id && plant_type_id !== plant.plant_type_id) {
      const plantType = await PlantType.findByPk(plant_type_id);
      if (!plantType) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Plant type not found'
        };
        return res.status(400).json(response);
      }
    }
    
    // Update plant
    await plant.update({
      name: name || plant.name,
      location: location || plant.location,
      plant_type_id: plant_type_id || plant.plant_type_id
    });
    
    // Get updated plant with relations
    const updatedPlant = await Plant.findByPk(id, {
      include: [
        {
          model: PlantType,
          as: 'plantType'
        }
      ]
    });
    
    const response: ApiResponse<typeof updatedPlant> = {
      success: true,
      data: updatedPlant,
      message: 'Plant updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error updating plant:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update plant'
    };
    res.status(500).json(response);
  }
};

// DELETE /api/my-plants/:id - Delete user's plant
export const deleteMyPlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    // Find plant and verify ownership
    const plant = await Plant.findOne({
      where: { 
        plant_id: id,
        user_id: userId
      }
    });
    
    if (!plant) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant not found or access denied'
      };
      return res.status(404).json(response);
    }
    
    await plant.destroy();
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Plant deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error deleting plant:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete plant'
    };
    res.status(500).json(response);
  }
};