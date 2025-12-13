import { Request, Response } from 'express';
import { PlantType } from '../models';
import { ApiResponse } from '../types';

// GET /api/plant-types - Получить все типы растений
export const getAllPlantTypes = async (req: Request, res: Response) => {
  try {
    const plantTypes = await PlantType.findAll();
    
    const response: ApiResponse<typeof plantTypes> = {
      success: true,
      data: plantTypes,
      message: 'Plant types retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching plant types:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch plant types'
    };
    res.status(500).json(response);
  }
};

// GET /api/plant-types/:id - Получить тип растения по ID
export const getPlantTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plantType = await PlantType.findByPk(id);
    
    if (!plantType) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant type not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof plantType> = {
      success: true,
      data: plantType,
      message: 'Plant type retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching plant type:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch plant type'
    };
    res.status(500).json(response);
  }
};

// POST /api/plant-types - Создать новый тип растения
export const createPlantType = async (req: Request, res: Response) => {
  try {
    const { name, optimal_humidity, optimal_temperature, optimal_light, watering_frequency } = req.body;
    
    const plantType = await PlantType.create({
      name,
      optimal_humidity,
      optimal_temperature,
      optimal_light,
      watering_frequency
    });
    
    const response: ApiResponse<typeof plantType> = {
      success: true,
      data: plantType,
      message: 'Plant type created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating plant type:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create plant type'
    };
    res.status(500).json(response);
  }
};

// PUT /api/plant-types/:id - Обновить тип растения
export const updatePlantType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, optimal_humidity, optimal_temperature, optimal_light, watering_frequency } = req.body;
    
    const plantType = await PlantType.findByPk(id);
    if (!plantType) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant type not found'
      };
      return res.status(404).json(response);
    }
    
    await plantType.update({
      name: name || plantType.name,
      optimal_humidity: optimal_humidity !== undefined ? optimal_humidity : plantType.optimal_humidity,
      optimal_temperature: optimal_temperature !== undefined ? optimal_temperature : plantType.optimal_temperature,
      optimal_light: optimal_light !== undefined ? optimal_light : plantType.optimal_light,
      watering_frequency: watering_frequency !== undefined ? watering_frequency : plantType.watering_frequency
    });
    
    const response: ApiResponse<typeof plantType> = {
      success: true,
      data: plantType,
      message: 'Plant type updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error updating plant type:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update plant type'
    };
    res.status(500).json(response);
  }
};

// DELETE /api/plant-types/:id - Удалить тип растения
export const deletePlantType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const plantType = await PlantType.findByPk(id);
    if (!plantType) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Plant type not found'
      };
      return res.status(404).json(response);
    }
    
    await plantType.destroy();
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'Plant type deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error deleting plant type:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete plant type'
    };
    res.status(500).json(response);
  }
};