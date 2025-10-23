const mongoose = require('../../config/db_mongoose');
const { Schema } = mongoose;

const conhecimentoAlunoSchema = new Schema({
  aluno_id: {
    type: Number,
    required: true,
  },
  conhecimentos: [{
    conhecimento_id: {
      type: Number,
      required: true,
    },
    nivel: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    _id: false
  }],
});

const ConhecimentoAluno = mongoose.model('ConhecimentoAluno', conhecimentoAlunoSchema);

module.exports = ConhecimentoAluno;
