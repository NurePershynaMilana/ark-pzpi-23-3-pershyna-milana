import { Router } from 'express';
import {
  getAllSensorData,
  getSensorDataById,
  createSensorData,
  createBulkSensorData,
  deleteSensorData,
  getDataBySensorId
} from '../controllers/sensorDataController';

const router = Router();

/**
 * @swagger
 * /api/sensor-data:
 *   get:
 *     summary: Отримати всі дані датчиків
 *     tags: [Sensor Data]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Список даних датчиків
 */
router.get('/', getAllSensorData);

/**
 * @swagger
 * /api/sensor-data/{id}:
 *   get:
 *     summary: Отримати дані датчика по ID
 *     tags: [Sensor Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані датчика
 */
router.get('/:id', getSensorDataById);

/**
 * @swagger
 * /api/sensors/{sensorId}/data:
 *   get:
 *     summary: Отримати дані конкретного датчика
 *     tags: [Sensor Data]
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Дані датчика за період
 */
router.get('/sensors/:sensorId/data', getDataBySensorId);

/**
 * @swagger
 * /api/sensor-data:
 *   post:
 *     summary: Створити нову запис даних датчика
 *     tags: [Sensor Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensor_id
 *               - value
 *             properties:
 *               sensor_id:
 *                 type: integer
 *               value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Дані датчика створено
 */
router.post('/', createSensorData);

/**
 * @swagger
 * /api/sensor-data/bulk:
 *   post:
 *     summary: Створити множину записів даних (для IoT)
 *     tags: [Sensor Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sensor_id:
 *                       type: integer
 *                     value:
 *                       type: number
 *     responses:
 *       201:
 *         description: Множину записів створено
 */
router.post('/bulk', createBulkSensorData);

/**
 * @swagger
 * /api/sensor-data/{id}:
 *   delete:
 *     summary: Видалити запис даних датчика
 *     tags: [Sensor Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані датчика видалено
 */
router.delete('/:id', deleteSensorData);

export default router;