import { Request, Response } from 'express';
import { Plant, User, PlantType } from '../models';
import { ApiResponse, CreatePlantRequest } from '../types';

// GET /api/plants
export const getAllPlants = async (req: Request, res: Response) => {
  try {
    const plants = await Plant.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        },
        {
          model: PlantType,
          as: 'plantType',
          attributes: ['plant_type_id', 'name', 'optimal_humidity', 'optimal_temperature', 'optimal_light', 'watering_frequency']
        }
      ]
    });
    
    const response: ApiResponse<typeof plants> = {
      success: true,
      data: plants,
      message: 'Plants retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching plants:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch plants'
    };
    res.status(500).json(response);
  }
};

// GET /api/plants/:id
export const getPlantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        },
        {
          model: PlantType,
          as: 'plantType'
        }
      ]
    });
    
    if (!plant) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant not found'
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

// GET /api/users/:userId/plants
export const getPlantsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const plants = await Plant.findAll({
      where: { user_id: userId },
      include: [
        {
          model: PlantType,
          as: 'plantType'
        }
      ]
    });
    
    const response: ApiResponse<typeof plants> = {
      success: true,
      data: plants,
      message: 'User plants retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching user plants:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch user plants'
    };
    res.status(500).json(response);
  }
};

// POST /api/plants
export const createPlant = async (req: Request, res: Response) => {
  try {
    const { user_id, plant_type_id, name, location }: CreatePlantRequest = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      return res.status(400).json(response);
    }

    const plantType = await PlantType.findByPk(plant_type_id);
    if (!plantType) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant type not found'
      };
      return res.status(400).json(response);
    }
    
    const plant = await Plant.create({
      user_id,
      plant_type_id,
      name,
      location
    });

    const createdPlant = await Plant.findByPk(plant.plant_id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        },
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

// PUT /api/plants/:id
export const updatePlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, plant_type_id } = req.body;
    
    const plant = await Plant.findByPk(id);
    if (!plant) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant not found'
      };
      return res.status(404).json(response);
    }

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
    
    await plant.update({
      name: name || plant.name,
      location: location || plant.location,
      plant_type_id: plant_type_id || plant.plant_type_id
    });

    const updatedPlant = await Plant.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        },
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

// DELETE /api/plants/:id
export const deletePlant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const plant = await Plant.findByPk(id);
    if (!plant) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant not found'
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