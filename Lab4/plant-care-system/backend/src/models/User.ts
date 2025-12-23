import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserInterface {
  user_id?: number;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  role?: 'user' | 'admin';
  last_login?: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserInterface, 'user_id' | 'role' | 'last_login' | 'created_at' | 'updated_at'> {}

class User extends Model<UserInterface, UserCreationAttributes> implements UserInterface {
  declare user_id: number;
  declare email: string;
  declare first_name: string;
  declare last_name: string;
  declare password_hash: string;
  declare role: 'user' | 'admin';
  declare last_login: Date;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  declare plants?: any[];
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
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
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