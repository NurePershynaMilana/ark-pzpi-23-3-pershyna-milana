import { Router } from 'express';
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantsByUserId
} from '../controllers/plantController';

const router = Router();

/**
 * @swagger
 * /api/plants:
 *   get:
 *     summary: Отримати всі рослини (адміністративний доступ)
 *     tags: [Plants (Admin)]
 *     responses:
 *       200:
 *         description: Список всіх рослин
 */
router.get('/', getAllPlants);

/**
 * @swagger
 * /api/plants/{id}:
 *   get:
 *     summary: Отримати рослину по ID
 *     tags: [Plants (Admin)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Дані рослини
 */
router.get('/:id', getPlantById);

/**
 * @swagger
 * /api/users/{userId}/plants:
 *   get:
 *     summary: Отримати рослини конкретного користувача
 *     tags: [Plants (Admin)]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Рослини користувача
 */
router.get('/users/:userId/plants', getPlantsByUserId);

/**
 * @swagger
 * /api/plants:
 *   post:
 *     summary: Створити нову рослину
 *     tags: [Plants (Admin)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - plant_type_id
 *               - name
 *               - location
 *             properties:
 *               user_id:
 *                 type: integer
 *               plant_type_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Рослину створено
 */
router.post('/', createPlant);

/**
 * @swagger
 * /api/plants/{id}:
 *   put:
 *     summary: Оновити рослину
 *     tags: [Plants (Admin)]
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
 *               location:
 *                 type: string
 *               plant_type_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Рослину оновлено
 */
router.put('/:id', updatePlant);

/**
 * @swagger
 * /api/plants/{id}:
 *   delete:
 *     summary: Видалити рослину
 *     tags: [Plants (Admin)]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Рослину видалено
 */
router.delete('/:id', deletePlant);

export default router;