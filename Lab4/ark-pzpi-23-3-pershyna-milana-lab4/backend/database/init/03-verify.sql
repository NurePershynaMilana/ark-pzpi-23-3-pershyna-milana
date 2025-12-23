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
SELECT 'Sensor data:', COUNT(*) FROM sensor_data
UNION ALL
SELECT 'Plant actions:', COUNT(*) FROM plant_actions;

-- Перевірка ролей користувачів
SELECT 
    first_name || ' ' || last_name as user_name,
    email,
    role,
    last_login
FROM users
ORDER BY role DESC, first_name;

-- Приклад складного запиту для перевірки зв'язків
-- Показує останні показання всіх датчиків для кожного користувача
SELECT 
    u.first_name || ' ' || u.last_name as user_name,
    u.email,
    u.role,
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

-- Перевірка дій з рослинами за сьогодні
SELECT 
    u.first_name || ' ' || u.last_name as user_name,
    p.name as plant_name,
    pa.action_type,
    pa.action_value,
    pa.action_duration,
    pa.notes,
    pa.performed_at
FROM plant_actions pa
JOIN plants p ON pa.plant_id = p.plant_id
JOIN users u ON pa.user_id = u.user_id
WHERE pa.performed_at >= CURRENT_DATE
ORDER BY pa.performed_at DESC;

-- Статистика дій по типах за останні 3 дні
SELECT 
    action_type,
    COUNT(*) as actions_count,
    COUNT(DISTINCT plant_id) as plants_affected,
    COUNT(DISTINCT user_id) as users_involved
FROM plant_actions 
WHERE performed_at >= CURRENT_DATE - INTERVAL '3 days'
GROUP BY action_type
ORDER BY actions_count DESC;

-- Виведення інформації про успішну ініціалізацію
SELECT 
    'База даних успішно ініціалізована з новими функціями!' as status,
    CURRENT_TIMESTAMP as initialized_at;