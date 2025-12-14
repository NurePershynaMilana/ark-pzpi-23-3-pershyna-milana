import { Router } from 'express';
import {
  getMyPlants,
  getMyPlantById,
  createMyPlant,
  updateMyPlant,
  deleteMyPlant
} from '../controllers/userPlantsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Все маршруты требуют аутентификации
router.use(requireAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     MyPlant:
 *       type: object
 *       properties:
 *         plant_id:
 *           type: integer
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         plant_type_id:
 *           type: integer
 *         plantType:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             optimal_humidity:
 *               type: number
 *             optimal_temperature:
 *               type: number
 *             optimal_light:
 *               type: integer
 *             watering_frequency:
 *               type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *     CreateMyPlantRequest:
 *       type: object
 *       required:
 *         - plant_type_id
 *         - name
 *         - location
 *       properties:
 *         plant_type_id:
 *           type: integer
 *           description: ID типу рослини
 *         name:
 *           type: string
 *           description: Назва рослини
 *         location:
 *           type: string
 *           description: Розташування рослини
 */

/**
 * @swagger
 * /api/my-plants:
 *   get:
 *     summary: Отримати всі рослини поточного користувача
 *     tags: [My Plants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список рослин користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MyPlant'
 *                 message:
 *                   type: string
 *       401:
 *         description: Не автентифікований
 */
router.get('/', getMyPlants);

/**
 * @swagger
 * /api/my-plants/{id}:
 *   get:
 *     summary: Отримати конкретну рослину користувача
 *     tags: [My Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рослини
 *     responses:
 *       200:
 *         description: Дані рослини з датчиками
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MyPlant'
 *                 message:
 *                   type: string
 *       404:
 *         description: Рослину не знайдено або немає доступу
 *       401:
 *         description: Не автентифікований
 */
router.get('/:id', getMyPlantById);

/**
 * @swagger
 * /api/my-plants:
 *   post:
 *     summary: Додати нову рослину
 *     tags: [My Plants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMyPlantRequest'
 *     responses:
 *       201:
 *         description: Рослину успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MyPlant'
 *                 message:
 *                   type: string
 *       400:
 *         description: Помилка валідації або тип рослини не знайдено
 *       401:
 *         description: Не автентифікований
 */
router.post('/', createMyPlant);

/**
 * @swagger
 * /api/my-plants/{id}:
 *   put:
 *     summary: Оновити свою рослину
 *     tags: [My Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рослини
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
 *         description: Рослину успішно оновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/MyPlant'
 *                 message:
 *                   type: string
 *       404:
 *         description: Рослину не знайдено або немає доступу
 *       401:
 *         description: Не автентифікований
 */
router.put('/:id', updateMyPlant);

/**
 * @swagger
 * /api/my-plants/{id}:
 *   delete:
 *     summary: Видалити свою рослину
 *     tags: [My Plants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID рослини
 *     responses:
 *       200:
 *         description: Рослину успішно видалено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Рослину не знайдено або немає доступу
 *       401:
 *         description: Не автентифікований
 */
router.delete('/:id', deleteMyPlant);

export default router;