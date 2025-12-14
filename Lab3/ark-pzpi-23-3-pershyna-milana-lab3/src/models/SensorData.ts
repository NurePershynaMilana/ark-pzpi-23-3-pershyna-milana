import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { SensorData as SensorDataInterface } from '../types';

interface SensorDataCreationAttributes extends Optional<SensorDataInterface, 'data_id' | 'timestamp' | 'created_at'> {}

class SensorData extends Model<SensorDataInterface, SensorDataCreationAttributes> implements SensorDataInterface {
  declare data_id: number;
  declare sensor_id: number;
  declare value: number;
  declare readonly timestamp: Date;
  declare readonly created_at: Date;

  // Ассоциации
  declare sensor?: any;
}

SensorData.init({
  data_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sensor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sensors',
      key: 'sensor_id'
    }
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  tableName: 'sensor_data',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default SensorData;