import { Router } from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser
} from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email користувача
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Пароль користувача
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - first_name
 *         - last_name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email користувача
 *         first_name:
 *           type: string
 *           description: Ім'я користувача
 *         last_name:
 *           type: string
 *           description: Прізвище користувача
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Пароль користувача
 *     LoginResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *             email:
 *               type: string
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             role:
 *               type: string
 *               enum: [user, admin]
 *             last_login:
 *               type: string
 *               format: date-time
 *         token:
 *           type: string
 *           description: JWT токен для автентифікації
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Користувача успішно зареєстровано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *                 message:
 *                   type: string
 *       400:
 *         description: Помилка валідації або користувач вже існує
 *       500:
 *         description: Помилка сервера
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вхід в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Успішний вхід в систему
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LoginResponse'
 *                 message:
 *                   type: string
 *       401:
 *         description: Неправильний email або пароль
 *       400:
 *         description: Email та пароль обов'язкові
 *       500:
 *         description: Помилка сервера
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Вихід з системи
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успішний вихід з системи
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Не автентифікований
 */
router.post('/logout', requireAuth, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Отримати профіль поточного користувача
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профіль користувача
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
 *                     user_id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     last_login:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *       401:
 *         description: Не автентифікований
 *       404:
 *         description: Користувача не знайдено
 */
router.get('/me', requireAuth, getCurrentUser);

export default router;