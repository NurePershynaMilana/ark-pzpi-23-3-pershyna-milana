import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import userPlantsRoutes from './userPlantsRoutes';
import plantRoutes from './plantRoutes';
import plantTypeRoutes from './plantTypeRoutes';
import sensorRoutes from './sensorRoutes';
import sensorDataRoutes from './sensorDataRoutes';
import smartSensorRoutes from './smartSensorRoutes';

const router = Router();

router.use('/auth', authRoutes);           
router.use('/my-plants', userPlantsRoutes);
router.use('/users', userRoutes);
router.use('/plants', plantRoutes);
router.use('/plant-types', plantTypeRoutes);
router.use('/sensors', sensorRoutes);
router.use('/sensor-data', sensorDataRoutes);
router.use('/sensors/:sensorId/data', sensorDataRoutes);
router.use('/sensors', smartSensorRoutes);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Plant Care System API v1.0 - Lab 3',
    endpoints: {
      auth: '/api/auth',
      my_plants: '/api/my-plants',
      users: '/api/users',
      plants: '/api/plants',
      plant_types: '/api/plant-types',
      sensors: '/api/sensors',
      sensor_data: '/api/sensor-data'
    },
    documentation: '/api/docs'
  });
});

export default router;