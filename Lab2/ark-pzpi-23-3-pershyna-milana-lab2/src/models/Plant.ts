import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Plant as PlantInterface } from '../types';

interface PlantCreationAttributes extends Optional<PlantInterface, 'plant_id' | 'created_at' | 'updated_at'> {}

class Plant extends Model<PlantInterface, PlantCreationAttributes> implements PlantInterface {
  public plant_id!: number;
  public user_id!: number;
  public plant_type_id!: number;
  public name!: string;
  public location!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Plant.init({
  plant_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  plant_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'plant_types',
      key: 'plant_type_id'
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  tableName: 'plants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Plant;