import sequelize from '../config/database';
import User from './User';
import PlantType from './PlantType';
import Plant from './Plant';
import Sensor from './Sensor';
import SensorData from './SensorData';

// User associations
User.hasMany(Plant, { foreignKey: 'user_id', as: 'plants' });
Plant.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// PlantType associations
PlantType.hasMany(Plant, { foreignKey: 'plant_type_id', as: 'plants' });
Plant.belongsTo(PlantType, { foreignKey: 'plant_type_id', as: 'plantType' });

// Plant-Sensor associations
Plant.hasMany(Sensor, { foreignKey: 'plant_id', as: 'sensors' });
Sensor.belongsTo(Plant, { foreignKey: 'plant_id', as: 'plant' });

// Sensor-SensorData associations
Sensor.hasMany(SensorData, { foreignKey: 'sensor_id', as: 'sensorData' });
SensorData.belongsTo(Sensor, { foreignKey: 'sensor_id', as: 'sensor' });

export {
  sequelize,
  User,
  PlantType,
  Plant,
  Sensor,
  SensorData
};

export default {
  sequelize,
  User,
  PlantType,
  Plant,
  Sensor,
  SensorData
};