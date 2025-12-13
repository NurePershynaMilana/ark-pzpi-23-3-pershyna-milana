-- Заповнення тестовими даними

-- Додавання користувачів
INSERT INTO users (email, first_name, last_name, password_hash) VALUES
('ivan.petrenko@email.com', 'Іван', 'Петренко', '$2b$10$hashedpassword1'),
('maria.kovalenko@email.com', 'Марія', 'Коваленко', '$2b$10$hashedpassword2'),
('oleh.shevchenko@email.com', 'Олег', 'Шевченко', '$2b$10$hashedpassword3');

-- Додавання типів рослин
INSERT INTO plant_types (name, optimal_humidity, optimal_temperature, optimal_light, watering_frequency) VALUES
('Фіалка кімнатна', 65.0, 20.0, 15000, 3),
('Кактус', 30.0, 25.0, 25000, 7),
('Папороть', 80.0, 18.0, 8000, 2),
('Фікус Бенджаміна', 55.0, 22.0, 12000, 4),
('Алое Вера', 25.0, 24.0, 20000, 10),
('Спатіфілум', 70.0, 21.0, 10000, 3);

-- Додавання рослин
INSERT INTO plants (user_id, plant_type_id, name, location) VALUES
(1, 1, 'Моя улюблена фіалка', 'Підвіконня кухні'),
(1, 2, 'Колючий друг', 'Стіл у вітальні'),
(1, 4, 'Фікус Івана', 'Кут вітальні'),
(2, 3, 'Зелена красуня', 'Кімната біля вікна'),
(2, 1, 'Фіалка Марії', 'Спальня'),
(2, 6, 'Жіноче щастя', 'Кухня'),
(3, 2, 'Маленький кактус', 'Робочий стіл'),
(3, 3, 'Папороть Олега', 'Коридор'),
(3, 5, 'Лікувальне алое', 'Ванна кімната');

-- Додавання датчиків
INSERT INTO sensors (plant_id, sensor_type, hardware_id, is_active) VALUES
-- Датчики для рослини 1 (фіалка Івана)
(1, 'humidity', 'HUM_001_A1B2', true),
(1, 'temperature', 'TEMP_001_C3D4', true),
(1, 'light', 'LIGHT_001_E5F6', true),
-- Датчики для рослини 2 (кактус Івана)
(2, 'humidity', 'HUM_002_G7H8', true),
(2, 'temperature', 'TEMP_002_I9J0', true),
(2, 'light', 'LIGHT_002_K1L2', true),
-- Датчики для рослини 3 (фікус Івана)
(3, 'humidity', 'HUM_003_M3N4', true),
(3, 'temperature', 'TEMP_003_O5P6', true),
-- Датчики для рослини 4 (папороть Марії)
(4, 'humidity', 'HUM_004_Q7R8', true),
(4, 'temperature', 'TEMP_004_S9T0', true),
(4, 'light', 'LIGHT_004_U1V2', true),
-- Датчики для рослини 5 (фіалка Марії)
(5, 'humidity', 'HUM_005_W3X4', true),
(5, 'temperature', 'TEMP_005_Y5Z6', true),
-- Датчики для рослини 6 (спатіфілум Марії)
(6, 'humidity', 'HUM_006_A7B8', true),
(6, 'temperature', 'TEMP_006_C9D0', true),
(6, 'light', 'LIGHT_006_E1F2', true),
-- Датчики для рослини 7 (кактус Олега)
(7, 'humidity', 'HUM_007_G3H4', true),
(7, 'temperature', 'TEMP_007_I5J6', true),
-- Датчики для рослини 8 (папороть Олега)
(8, 'humidity', 'HUM_008_K7L8', true),
(8, 'temperature', 'TEMP_008_M9N0', true),
-- Датчики для рослини 9 (алое Олега)
(9, 'humidity', 'HUM_009_O1P2', true),
(9, 'temperature', 'TEMP_009_Q3R4', true),
(9, 'light', 'LIGHT_009_S5T6', true);

-- Додавання даних з датчиків (останні кілька вимірювань)
INSERT INTO sensor_data (sensor_id, value, timestamp) VALUES
-- Дані з датчика вологості фіалки Івана
(1, 68.5, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(1, 67.2, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(1, 69.1, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(1, 66.8, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Дані з датчика температури фіалки Івана
(2, 21.3, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(2, 20.8, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(2, 21.0, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(2, 20.5, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Дані з датчика освітлення фіалки Івана
(3, 14500, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(3, 16200, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(3, 15800, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(3, 14200, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Дані з датчика вологості кактуса Івана
(4, 28.3, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(4, 29.1, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(4, 27.8, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(4, 28.9, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Дані з датчика температури кактуса Івана
(5, 26.2, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(5, 25.8, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(5, 26.5, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(5, 25.3, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Дані з датчика освітлення кактуса Івана
(6, 24500, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(6, 25200, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(6, 23800, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(6, 24100, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Дані з датчика вологості фікуса Івана
(7, 56.2, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(7, 55.8, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(7, 57.1, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика температури фікуса Івана
(8, 22.5, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(8, 22.1, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(8, 22.8, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика вологості папороті Марії
(9, 82.1, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(9, 81.5, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(9, 83.2, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
(9, 80.8, CURRENT_TIMESTAMP - INTERVAL '1 hour'),

-- Дані з датчика температури папороті Марії
(10, 18.7, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(10, 18.3, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(10, 18.9, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика освітлення папороті Марії
(11, 7800, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(11, 8200, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(11, 7600, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика вологості фіалки Марії
(12, 63.4, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(12, 64.8, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(12, 62.9, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика температури фіалки Марії
(13, 19.8, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(13, 20.2, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(13, 19.5, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика вологості спатіфілума Марії
(14, 71.2, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(14, 70.8, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(14, 72.1, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика температури спатіфілума Марії
(15, 21.3, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(15, 20.9, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(15, 21.6, CURRENT_TIMESTAMP - INTERVAL '45 minutes'),

-- Дані з датчика освітлення спатіфілума Марії
(16, 9800, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(16, 10200, CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
(16, 9600, CURRENT_TIMESTAMP - INTERVAL '45 minutes');