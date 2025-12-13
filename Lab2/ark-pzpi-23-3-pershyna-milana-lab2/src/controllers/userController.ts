import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { ApiResponse, CreateUserRequest } from '../types';

// GET /api/users - Получить всех пользователей
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] } // Исключаем пароль из ответа
    });
    
    const response: ApiResponse<typeof users> = {
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch users'
    };
    res.status(500).json(response);
  }
};

// GET /api/users/:id - Получить пользователя по ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof user> = {
      success: true,
      data: user,
      message: 'User retrieved successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch user'
    };
    res.status(500).json(response);
  }
};

// POST /api/users - Создать нового пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, first_name, last_name, password }: CreateUserRequest = req.body;
    
    // Проверяем, не существует ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User with this email already exists'
      };
      return res.status(400).json(response);
    }
    
    // Хэшируем пароль
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    // Создаем пользователя
    const user = await User.create({
      email,
      first_name,
      last_name,
      password_hash
    });
    
    // Возвращаем пользователя без пароля
    const userResponse = await User.findByPk(user.user_id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    const response: ApiResponse<typeof userResponse> = {
      success: true,
      data: userResponse,
      message: 'User created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating user:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create user'
    };
    res.status(500).json(response);
  }
};

// PUT /api/users/:id - Обновить пользователя
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }
    
    // Обновляем пользователя
    await user.update({
      email: email || user.email,
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name
    });
    
    // Возвращаем обновленного пользователя без пароля
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    const response: ApiResponse<typeof updatedUser> = {
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update user'
    };
    res.status(500).json(response);
  }
};

// DELETE /api/users/:id - Удалить пользователя
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'User not found'
      };
      return res.status(404).json(response);
    }
    
    await user.destroy();
    
    const response: ApiResponse<null> = {
      success: true,
      message: 'User deleted successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error deleting user:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete user'
    };
    res.status(500).json(response);
  }
};