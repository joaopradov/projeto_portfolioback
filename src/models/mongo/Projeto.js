// src/models/mongo/Projeto.js
const mongoose = require('../../config/db_mongoose');
const { Schema } = mongoose;

const projetoSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  resumo: {
    type: String,
    required: true,
  },
  link_externo: {
    type: String,
    required: true,
  },
  desenvolvedores_ids: [{
    type: Number,
    required: true,
  }],
  palavras_chave_ids: [{
    type: Number,
    required: true,
  }],
}, {
  timestamps: true,
});

const Projeto = mongoose.model('Projeto', projetoSchema);

module.exports = Projeto;
