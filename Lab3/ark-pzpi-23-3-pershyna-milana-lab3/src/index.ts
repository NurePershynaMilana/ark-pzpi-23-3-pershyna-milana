import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { sequelize } from './models';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet()); 
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plant Care System API',
      version: '1.0.0',
      description: 'REST API для системы догляду за рослинами - Лабораторна робота №2',
      contact: {
        name: 'Milana',
        email: 'your.email@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Users',
        description: 'Операції з користувачами'
      },
      {
        name: 'Plant Types',
        description: 'Операції з типами рослин'
      },
      {
        name: 'Plants',
        description: 'Операції з рослинами'
      },
      {
        name: 'Sensors',
        description: 'Операції з датчиками'
      },
      {
        name: 'Sensor Data',
        description: 'Операції з даними датчиків'
      }
    ]
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({
    message: 'Plant Care System Backend - Lab 2',
    status: 'OK',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api/docs`,
    endpoints: {
      api: '/api',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Connected'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false, alter: false });
      console.log('Database models synchronized');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
      console.log(`Health Check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;