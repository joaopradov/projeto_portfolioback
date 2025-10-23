const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_sequelize');

const PalavraChave = sequelize.define('PalavraChave', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'palavras_chave',
  timestamps: false,
});

module.exports = PalavraChave;
