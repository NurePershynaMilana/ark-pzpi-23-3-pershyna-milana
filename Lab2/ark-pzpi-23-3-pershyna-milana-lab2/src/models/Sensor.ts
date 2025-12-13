import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Sensor as SensorInterface } from '../types';

interface SensorCreationAttributes extends Optional<SensorInterface, 'sensor_id'> {}

class Sensor extends Model<SensorInterface, SensorCreationAttributes> implements SensorInterface {
  public sensor_id!: number;
  public plant_id!: number;
  public sensor_type!: 'humidity' | 'temperature' | 'light';
  public hardware_id!: string;
  public is_active!: boolean;
}

Sensor.init({
  sensor_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  plant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'plants',
      key: 'plant_id'
    }
  },
  sensor_type: {
    type: DataTypes.ENUM('humidity', 'temperature', 'light'),
    allowNull: false,
  },
  hardware_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  sequelize,
  tableName: 'sensors',
  timestamps: false,
});

export default Sensor;