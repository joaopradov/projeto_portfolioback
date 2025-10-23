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
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Link externo deve ser uma URL válida.'
    }
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
