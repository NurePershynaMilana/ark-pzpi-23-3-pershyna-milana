import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

router.use('/users', userRoutes);

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Plant Care System API v1.0',
    endpoints: {
      users: '/api/users',
      plant_types: '/api/plant-types',
      plants: '/api/plants',
      sensors: '/api/sensors',
      sensor_data: '/api/sensor-data'
    },
    documentation: '/api/docs'
  });
});

export default router;