const bcrypt = require('bcryptjs');
const sequelize = require('../src/config/db_sequelize'); // 
const Administrador = require('../src/models/postgres/Administrador');
const Aluno = require('../src/models/postgres/Aluno');

async function seedDatabase() {
  try {
    await sequelize.sync();
    console.log('Conexão estabelecida e tabelas sincronizadas.');

    // --- CRIAÇÃO DO ADMINISTRADOR DE TESTE ---
    const adminEmail = 'admin@utfpr.edu.br';
    const adminExists = await Administrador.findOne({ where: { email: adminEmail } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await Administrador.create({
        nome: 'Admin Padrão',
        email: adminEmail,
        senha: hashedPassword,
      });
      console.log('Administrador de teste criado com sucesso!');
      console.log(` -> Email: ${adminEmail}`);
      console.log(` -> Senha: admin123`);
    } else {
      console.log('Administrador de teste já existe.');
    }

    // --- CRIAÇÃO DO ALUNO DE TESTE ---
    const alunoEmail = 'aluno@utfpr.edu.br';
    const alunoExists = await Aluno.findOne({ where: { email: alunoEmail } });

    if (!alunoExists) {
        const hashedPassword = await bcrypt.hash('aluno123', 12);
        await Aluno.create({
            nome_completo: 'Aluno de Teste',
            email: alunoEmail,
            senha: hashedPassword,
        });
        console.log('Aluno de teste criado com sucesso!');
        console.log(` -> Email: ${alunoEmail}`);
        console.log(` -> Senha: aluno123`);
    } else {
        console.log('Aluno de teste já existe.');
    }

    console.log('Processo de seeding finalizado.');

  } catch (error) {
    console.error('Falha no processo de seeding:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
