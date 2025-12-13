-- Перевірочні запити для підтвердження створення даних

-- Статистика по таблицях
SELECT 'Users:' as table_name, COUNT(*) as records_count FROM users
UNION ALL
SELECT 'Plant types:', COUNT(*) FROM plant_types
UNION ALL
SELECT 'Plants:', COUNT(*) FROM plants
UNION ALL
SELECT 'Sensors:', COUNT(*) FROM sensors
UNION ALL
SELECT 'Sensor data:', COUNT(*) FROM sensor_data;

-- Приклад складного запиту для перевірки зв'язків
-- Показує останні показання всіх датчиків для кожного користувача
SELECT 
    u.first_name || ' ' || u.last_name as user_name,
    u.email,
    p.name as plant_name,
    pt.name as plant_type,
    s.sensor_type,
    sd.value as latest_value,
    sd.timestamp,
    CASE 
        WHEN s.sensor_type = 'humidity' AND sd.value BETWEEN (pt.optimal_humidity - 5) AND (pt.optimal_humidity + 5) THEN 'Норма'
        WHEN s.sensor_type = 'temperature' AND sd.value BETWEEN (pt.optimal_temperature - 2) AND (pt.optimal_temperature + 2) THEN 'Норма'
        WHEN s.sensor_type = 'light' AND sd.value BETWEEN (pt.optimal_light - 2000) AND (pt.optimal_light + 2000) THEN 'Норма'
        ELSE 'Потребує уваги'
    END as parameter_status
FROM users u
JOIN plants p ON u.user_id = p.user_id
JOIN plant_types pt ON p.plant_type_id = pt.plant_type_id
JOIN sensors s ON p.plant_id = s.plant_id
JOIN sensor_data sd ON s.sensor_id = sd.sensor_id
WHERE sd.timestamp = (
    SELECT MAX(timestamp) 
    FROM sensor_data 
    WHERE sensor_id = s.sensor_id
)
ORDER BY u.first_name, p.name, s.sensor_type;

-- Виведення інформації про успішну ініціалізацію
SELECT 
    'База даних успішно ініціалізована!' as status,
    CURRENT_TIMESTAMP as initialized_at;