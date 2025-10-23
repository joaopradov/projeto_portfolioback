const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_sequelize');

const Aluno = sequelize.define('Aluno', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome_completo: {
    type: DataTypes.STRING(150),
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
  tableName: 'alunos',
  timestamps: true,
});

module.exports = Aluno;