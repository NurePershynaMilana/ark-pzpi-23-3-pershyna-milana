import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User as UserInterface } from '../types';

interface UserCreationAttributes extends Optional<UserInterface, 'user_id' | 'created_at' | 'updated_at'> {}

class User extends Model<UserInterface, UserCreationAttributes> implements UserInterface {
  public user_id!: number;
  public email!: string;
  public first_name!: string;
  public last_name!: string;
  public password_hash!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.STRING(255),
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
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default User;