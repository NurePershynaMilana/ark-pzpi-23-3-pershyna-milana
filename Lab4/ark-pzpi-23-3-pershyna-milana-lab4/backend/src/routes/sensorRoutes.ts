import { Router } from 'express';
import {
  getAllSensors,
  getSensorById,
  createSensor,
  updateSensor,
  deleteSensor,
  getSensorsByPlantId
} from '../controllers/sensorController';

const router = Router();

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Отримати всі датчики
 *     tags: [Sensors]
 *     responses:
 *       200:
 *         description: Список датчиків
 */
router.get('/', getAllSensors);

/**
 * @swagger
 * /api/sensors/{id}:
 *   get:
 *     summary: Отримати датчик по ID
 *     tags: [Sensors]
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
router.get('/:id', getSensorById);

/**
 * @swagger
 * /api/plants/{plantId}/sensors:
 *   get:
 *     summary: Отримати датчики конкретної рослини
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: plantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Датчики рослини
 */
router.get('/plants/:plantId/sensors', getSensorsByPlantId);

/**
 * @swagger
 * /api/sensors:
 *   post:
 *     summary: Створити новий датчик
 *     tags: [Sensors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plant_id
 *               - sensor_type
 *               - hardware_id
 *             properties:
 *               plant_id:
 *                 type: integer
 *               sensor_type:
 *                 type: string
 *                 enum: [humidity, temperature, light]
 *               hardware_id:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Датчик створено
 */
router.post('/', createSensor);

/**
 * @swagger
 * /api/sensors/{id}:
 *   put:
 *     summary: Оновити датчик
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sensor_type:
 *                 type: string
 *               hardware_id:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Датчик оновлено
 */
router.put('/:id', updateSensor);

/**
 * @swagger
 * /api/sensors/{id}:
 *   delete:
 *     summary: Видалити датчик
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Датчик видалено
 */
router.delete('/:id', deleteSensor);

export default router;