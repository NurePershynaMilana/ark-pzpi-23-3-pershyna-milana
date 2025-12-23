import { Router } from 'express';
import {
  getAllPlantTypes,
  getPlantTypeById,
  createPlantType,
  updatePlantType,
  deletePlantType
} from '../controllers/plantTypeController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PlantType:
 *       type: object
 *       properties:
 *         plant_type_id:
 *           type: integer
 *         name:
 *           type: string
 *         optimal_humidity:
 *           type: number
 *         optimal_temperature:
 *           type: number
 *         optimal_light:
 *           type: integer
 *         watering_frequency:
 *           type: integer
 */

/**
 * @swagger
 * /api/plant-types:
 *   get:
 *     summary: Отримати всі типи рослин
 *     tags: [Plant Types]
 *     responses:
 *       200:
 *         description: Список типів рослин
 */
router.get('/', getAllPlantTypes);

/**
 * @swagger
 * /api/plant-types/{id}:
 *   get:
 *     summary: Отримати тип рослини по ID
 *     tags: [Plant Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані типу рослини
 */
router.get('/:id', getPlantTypeById);

/**
 * @swagger
 * /api/plant-types:
 *   post:
 *     summary: Створити новий тип рослини
 *     tags: [Plant Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - optimal_humidity
 *               - optimal_temperature
 *               - optimal_light
 *               - watering_frequency
 *             properties:
 *               name:
 *                 type: string
 *               optimal_humidity:
 *                 type: number
 *               optimal_temperature:
 *                 type: number
 *               optimal_light:
 *                 type: integer
 *               watering_frequency:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Тип рослини створено
 */
router.post('/', createPlantType);

/**
 * @swagger
 * /api/plant-types/{id}:
 *   put:
 *     summary: Оновити тип рослини
 *     tags: [Plant Types]
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
 *               name:
 *                 type: string
 *               optimal_humidity:
 *                 type: number
 *               optimal_temperature:
 *                 type: number
 *               optimal_light:
 *                 type: integer
 *               watering_frequency:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Тип рослини оновлено
 */
router.put('/:id', updatePlantType);

/**
 * @swagger
 * /api/plant-types/{id}:
 *   delete:
 *     summary: Видалити тип рослини
 *     tags: [Plant Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Тип рослини видалено
 */
router.delete('/:id', deletePlantType);

export default router;