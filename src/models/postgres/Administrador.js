const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_sequelize');

const Administrador = sequelize.define('Administrador', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'administradores',
  timestamps: true,
});

module.exports = Administrador;
