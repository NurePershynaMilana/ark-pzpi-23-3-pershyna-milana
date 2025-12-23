-- Створення бази даних системи догляду за рослинами
-- PostgreSQL Script для автоматичної ініціалізації

-- Видалення таблиць якщо вони існують (в правильному порядку через FK)
DROP TABLE IF EXISTS plant_actions CASCADE;
DROP TABLE IF EXISTS sensor_data CASCADE;
DROP TABLE IF EXISTS sensors CASCADE;
DROP TABLE IF EXISTS plants CASCADE;
DROP TABLE IF EXISTS plant_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Створення ENUM типів
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE action_type AS ENUM ('watering', 'lighting', 'ventilation', 'manual_check', 'fertilizing');

-- Створення таблиці користувачів
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці типів рослин
CREATE TABLE plant_types (
    plant_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    optimal_humidity FLOAT CHECK (optimal_humidity BETWEEN 0 AND 100),
    optimal_temperature FLOAT CHECK (optimal_temperature BETWEEN 5 AND 40),
    optimal_light INTEGER CHECK (optimal_light > 0),
    watering_frequency INTEGER CHECK (watering_frequency > 0)
);

-- Створення таблиці рослин
CREATE TABLE plants (
    plant_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    plant_type_id INTEGER NOT NULL REFERENCES plant_types(plant_type_id),
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці датчиків
CREATE TABLE sensors (
    sensor_id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(plant_id) ON DELETE CASCADE,
    sensor_type VARCHAR(20) CHECK (sensor_type IN ('humidity', 'temperature', 'light')),
    hardware_id VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE
);

-- Створення таблиці даних датчиків
CREATE TABLE sensor_data (
    data_id SERIAL PRIMARY KEY,
    sensor_id INTEGER NOT NULL REFERENCES sensors(sensor_id) ON DELETE CASCADE,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Нова таблиця дій з рослинами
CREATE TABLE plant_actions (
    action_id SERIAL PRIMARY KEY,
    plant_id INTEGER NOT NULL REFERENCES plants(plant_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action_type action_type NOT NULL,
    action_value VARCHAR(200), -- наприклад "полив 200мл", "освітлення включено на 2 години"
    action_duration INTEGER DEFAULT 0, -- тривалість у хвилинах (для освітлення, вентиляції)
    notes TEXT, -- додаткові нотатки
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення індексів для оптимізації запитів
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_plants_user ON plants(user_id);
CREATE INDEX idx_plants_type ON plants(plant_type_id);
CREATE INDEX idx_sensors_plant ON sensors(plant_id);
CREATE INDEX idx_sensor_data_sensor ON sensor_data(sensor_id);
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp);
CREATE INDEX idx_plant_actions_plant ON plant_actions(plant_id);
CREATE INDEX idx_plant_actions_date ON plant_actions(performed_at);
CREATE INDEX idx_plant_actions_type ON plant_actions(action_type);

-- Створення функції для автоматичного оновлення updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Створення тригерів для автоматичного оновлення часових міток
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plants_updated_at 
    BEFORE UPDATE ON plants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();