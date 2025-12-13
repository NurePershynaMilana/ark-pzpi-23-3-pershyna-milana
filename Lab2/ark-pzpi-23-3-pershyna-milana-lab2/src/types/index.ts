// Основні типи для API

export interface User {
  user_id?: number;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PlantType {
  plant_type_id?: number;
  name: string;
  optimal_humidity: number;
  optimal_temperature: number;
  optimal_light: number;
  watering_frequency: number;
}

export interface Plant {
  plant_id?: number;
  user_id: number;
  plant_type_id: number;
  name: string;
  location: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Sensor {
  sensor_id?: number;
  plant_id: number;
  sensor_type: 'humidity' | 'temperature' | 'light';
  hardware_id: string;
  is_active: boolean;
}

export interface SensorData {
  data_id?: number;
  sensor_id: number;
  value: number;
  timestamp?: Date;
  created_at?: Date;
}

// API Response типи
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Request body типи
export interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface CreatePlantRequest {
  user_id: number;
  plant_type_id: number;
  name: string;
  location: string;
}

export interface CreateSensorDataRequest {
  sensor_id: number;
  value: number;
}