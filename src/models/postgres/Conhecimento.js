const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_sequelize');

const Conhecimento = sequelize.define('Conhecimento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'conhecimentos',
  timestamps: false,
});

module.exports = Conhecimento;
