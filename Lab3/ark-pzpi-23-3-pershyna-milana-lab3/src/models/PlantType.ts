import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { PlantType as PlantTypeInterface } from '../types';

interface PlantTypeCreationAttributes extends Optional<PlantTypeInterface, 'plant_type_id'> {}

class PlantType extends Model<PlantTypeInterface, PlantTypeCreationAttributes> implements PlantTypeInterface {
  declare plant_type_id: number;
  declare name: string;
  declare optimal_humidity: number;
  declare optimal_temperature: number;
  declare optimal_light: number;
  declare watering_frequency: number;

  // Ассоциации
  declare plants?: any[];
}

PlantType.init({
  plant_type_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  optimal_humidity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  optimal_temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 5,
      max: 40
    }
  },
  optimal_light: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  watering_frequency: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  sequelize,
  tableName: 'plant_types',
  timestamps: false,
});

export default PlantType;