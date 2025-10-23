const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('A variável de ambiente MONGO_URI não foi definida.');
}

async function connectToMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conexão com o MongoDB estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao MongoDB:', error);
    process.exit(1);
  }
}

connectToMongo();

module.exports = mongoose;
