import { Router } from 'express';
import {
  analyzeSensorData,
  simulateIoTData
} from '../controllers/smartSensorController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DeviceCommand:
 *       type: object
 *       properties:
 *         device_type:
 *           type: string
 *           enum: [watering, lighting, ventilation, heating]
 *         action:
 *           type: string
 *           enum: [start, stop, adjust]
 *         value:
 *           type: number
 *           description: Значення для команди (мл води, люкси світла, температура)
 *         duration:
 *           type: integer
 *           description: Тривалість виконання в хвилинах
 *         priority:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         reason:
 *           type: string
 *           description: Пояснення причини команди
 *     PlantAnalysis:
 *       type: object
 *       properties:
 *         plant_id:
 *           type: integer
 *         plant_name:
 *           type: string
 *         plant_type:
 *           type: string
 *         current_conditions:
 *           type: object
 *           properties:
 *             humidity:
 *               type: number
 *             temperature:
 *               type: number
 *             light:
 *               type: number
 *         optimal_conditions:
 *           type: object
 *           properties:
 *             humidity:
 *               type: number
 *             temperature:
 *               type: number
 *             light:
 *               type: integer
 *             watering_frequency:
 *               type: integer
 *         deviations:
 *           type: object
 *           properties:
 *             humidity_deviation:
 *               type: number
 *             temperature_deviation:
 *               type: number
 *             light_deviation:
 *               type: number
 *         recommendations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DeviceCommand'
 *         overall_status:
 *           type: string
 *           enum: [healthy, needs_attention, critical]
 */

/**
 * @swagger
 * /api/sensors/analyze:
 *   post:
 *     summary: 🤖 Розумний аналіз даних датчиків з автоматичними командами
 *     description: |
 *       Аналізує дані від IoT датчиків, порівнює з оптимальними параметрами 
 *       та генерує команди для виконавчих пристроїв (полив, освітлення, вентиляція)
 *     tags: [Smart IoT Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hardware_ids
 *             properties:
 *               hardware_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["HUM_001_A1B2", "TEMP_001_C3D4", "LIGHT_001_E5F6"]
 *                 description: Масив Hardware ID датчиків для аналізу
 *     responses:
 *       200:
 *         description: Результат інтелектуального аналізу з рекомендаціями
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     analyzed_plants:
 *                       type: integer
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PlantAnalysis'
 *                     total_recommendations:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Невірний формат запиту
 *       500:
 *         description: Помилка аналізу
 */
router.post('/analyze', analyzeSensorData);

/**
 * @swagger
 * /api/sensors/simulate-iot:
 *   post:
 *     summary: 📡 Симуляція отримання даних від IoT пристроїв
 *     description: |
 *       Симулює отримання даних від реальних IoT датчиків.
 *       Генерує реалістичні показники з відхиленнями від оптимальних значень
 *       для демонстрації роботи системи.
 *     tags: [Smart IoT Analysis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plant_ids
 *             properties:
 *               plant_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: Масив ID рослин для симуляції
 *     responses:
 *       200:
 *         description: Симульовані дані успішно згенеровано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     simulated_sensors:
 *                       type: integer
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           hardware_id:
 *                             type: string
 *                           sensor_type:
 *                             type: string
 *                           plant_name:
 *                             type: string
 *                           value:
 *                             type: number
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *                 message:
 *                   type: string
 *       400:
 *         description: Невірний формат запиту
 *       500:
 *         description: Помилка симуляції
 */
router.post('/simulate-iot', simulateIoTData);

export default router;