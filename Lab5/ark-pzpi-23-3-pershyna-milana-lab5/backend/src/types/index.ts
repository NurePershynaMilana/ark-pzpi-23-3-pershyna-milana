export interface User {
  user_id?: number;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  role?: 'user' | 'admin';
  last_login?: Date;
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

export interface PlantAction {
  action_id?: number;
  plant_id: number;
  user_id: number;
  action_type: 'watering' | 'lighting' | 'ventilation' | 'manual_check' | 'fertilizing';
  action_value?: string;
  action_duration?: number;
  notes?: string;
  performed_at?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export interface CreatePlantActionRequest {
  plant_id: number;
  action_type: 'watering' | 'lighting' | 'ventilation' | 'manual_check' | 'fertilizing';
  action_value?: string;
  action_duration?: number;
  notes?: string;
}

// Plant analysis types
export interface PlantAnalysisResult {
  plant_id: number;
  status: 'healthy' | 'needs_attention' | 'critical';
  issues: PlantIssue[];
  recommendations: string[];
  last_checked: Date;
}

export interface PlantIssue {
  type: 'low_humidity' | 'high_humidity' | 'low_temperature' | 'high_temperature' | 'low_light' | 'high_light';
  severity: 'low' | 'medium' | 'high';
  current_value: number;
  optimal_range: string;
  message: string;
}

// Daily analytics types
export interface DailyAnalytics {
  date: string;
  plant_id: number;
  plant_name: string;
  actions_performed: PlantAction[];
  sensor_readings: {
    humidity: { min: number; max: number; avg: number; count: number };
    temperature: { min: number; max: number; avg: number; count: number };
    light: { min: number; max: number; avg: number; count: number };
  };
  status_changes: string[];
  recommendations_given: string[];
}

// Admin stats types
export interface AdminStats {
  total_users: number;
  total_plants: number;
  total_sensors: number;
  active_sensors: number;
  total_actions_today: number;
  actions_by_type: Record<string, number>;
  recent_registrations: number;
  system_health: 'healthy' | 'warning' | 'error';
}