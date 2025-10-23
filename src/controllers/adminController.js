const Aluno = require('../models/postgres/Aluno');
const Conhecimento = require('../models/postgres/Conhecimento');
const PalavraChave = require('../models/postgres/PalavraChave');
const bcrypt = require('bcryptjs');

exports.getDashboard = (req, res) => {
    res.render('admin/dashboard', {
        pageTitle: 'Painel do Administrador',
        user: req.session.user,
    });
};

exports.getGerenciarAlunos = async (req, res) => {
  try {
    const alunosInstances = await Aluno.findAll({ order: [['nome_completo', 'ASC']] });
    const alunos = alunosInstances.map(aluno => aluno.get({ plain: true}));

    res.render('admin/gerenciarAlunos', {
        pageTitle: 'Gerenciar Alunos',
        alunos: alunos,
    });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).send('Erro ao carregar a página.');
  }
};

exports.postCriarAluno = async (req, res) => {
  const { nome_completo, email, senha } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(senha, 12);
    await Aluno.create({
      nome_completo,
      email,
      senha: hashedPassword,
    });
    res.redirect('/admin/alunos');
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    res.redirect('/admin/alunos');
  }
};

exports.postExcluirAluno = async (req, res) => {
    const { id } = req.params;
    try {
        await Aluno.destroy({ where: { id: id } });
        res.redirect('/admin/alunos');
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        res.redirect('/admin/alunos');
    }
};

exports.getEditarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const alunoInstance = await Aluno.findByPk(id);
    if (!alunoInstance) {
      return res.redirect('/admin/alunos');
    }

    const aluno = alunoInstance.get({ plain: true });
    res.render('admin/editarAluno', {
      pageTitle: 'Editar Aluno',
      aluno: aluno,
    });
  } catch (error) {
    console.error('Erro ao buscar aluno para edição:', error);
    res.redirect('/admin/alunos');
  }
};

exports.postEditarAluno = async (req, res) => {
  const { id } = req.params;
  const { nome_completo, email, senha } = req.body;

  try {
    const aluno = await Aluno.findByPk(id);
    if (!aluno) {
      return res.status(404).send('Aluno não encontrado.');
    }

    aluno.nome_completo = nome_completo;
    aluno.email = email;
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 12);
      aluno.senha = hashedPassword;
    }

    await aluno.save();

    res.redirect('/admin/alunos');
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.redirect('/admin/alunos');
  }
};

exports.getGerenciarConhecimentos = async (req, res) => {
  try {
    const conhecimentosInstances = await Conhecimento.findAll({ order: [['nome', 'ASC']] });
    const conhecimentos = conhecimentosInstances.map(c => c.get({ plain: true }));
    res.render('admin/gerenciarConhecimentos', {
      pageTitle: 'Gerenciar Conhecimentos',
      conhecimentos: conhecimentos,
    });
  } catch (error) {
    console.error('Erro ao buscar conhecimentos:', error);
    res.status(500).send('Erro ao carregar a página.');
  }
};

exports.postCriarConhecimento = async (req, res) => {
  const { nome, descricao } = req.body;
  try {
    await Conhecimento.create({ nome, descricao });
    res.redirect('/admin/conhecimentos');
  } catch (error) {
    console.error('Erro ao criar conhecimento:', error);
    res.redirect('/admin/conhecimentos');
  }
};

exports.getEditarConhecimento = async (req, res) => {
    try {
        const { id } = req.params;
        const conhecimentoInstance = await Conhecimento.findByPk(id);
        const conhecimentosInstances = await Conhecimento.findAll({ order: [['nome', 'ASC']] });

        const conhecimentoEmEdicao = conhecimentoInstance ? conhecimentoInstance.get({ plain: true }) : null;
        const conhecimentos = conhecimentosInstances.map(c => c.get({ plain: true }));

        res.render('admin/gerenciarConhecimentos', {
            pageTitle: 'Editar Conhecimento',
            conhecimentos: conhecimentos,
            conhecimentoEmEdicao: conhecimentoEmEdicao,
        });
    } catch (error) {
        console.error('Erro ao buscar conhecimento para edição:', error);
        res.redirect('/admin/conhecimentos');
    }
};

exports.postEditarConhecimento = async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    try {
        await Conhecimento.update({ nome, descricao }, { where: { id: id } });
        res.redirect('/admin/conhecimentos');
    } catch (error) {
        console.error('Erro ao atualizar conhecimento:', error);
        res.redirect('/admin/conhecimentos');
    }
};

exports.postExcluirConhecimento = async (req, res) => {
    const { id } = req.params;
    try {
        await Conhecimento.destroy({ where: { id: id } });
        res.redirect('/admin/conhecimentos');
    } catch (error) {
        console.error('Erro ao excluir conhecimento:', error);
        res.redirect('/admin/conhecimentos');
    }
};

exports.getGerenciarPalavrasChave = async (req, res) => {
  try {
    const palavrasChaveInstances = await PalavraChave.findAll({ order: [['nome', 'ASC']] });
    const palavrasChave = palavrasChaveInstances.map(p => p.get({ plain: true }));
    res.render('admin/gerenciarPalavrasChave', {
      pageTitle: 'Gerenciar Palavras-chave',
      palavrasChave: palavrasChave,
    });
  } catch (error) {
    console.error('Erro ao buscar palavras-chave:', error);
    res.status(500).send('Erro ao carregar a página.');
  }
};

exports.postCriarPalavraChave = async (req, res) => {
  const { nome } = req.body;
  try {
    await PalavraChave.create({ nome });
    res.redirect('/admin/palavras-chave');
  } catch (error) {
    console.error('Erro ao criar palavra-chave:', error);
    res.redirect('/admin/palavras-chave');
  }
};

exports.getEditarPalavraChave = async (req, res) => {
    try {
        const { id } = req.params;
        const palavraChaveInstance = await PalavraChave.findByPk(id);
        const palavrasChaveInstances = await PalavraChave.findAll({ order: [['nome', 'ASC']] });

        const palavraChaveEmEdicao = palavraChaveInstance ? palavraChaveInstance.get({ plain: true }) : null;
        const palavrasChave = palavrasChaveInstances.map(p => p.get({ plain: true }));

        res.render('admin/gerenciarPalavrasChave', {
            pageTitle: 'Editar Palavra-chave',
            palavrasChave: palavrasChave,
            palavraChaveEmEdicao: palavraChaveEmEdicao,
        });
    } catch (error) {
        console.error('Erro ao buscar palavra-chave para edição:', error);
        res.redirect('/admin/palavras-chave');
    }
};

exports.postEditarPalavraChave = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    try {
        await PalavraChave.update({ nome }, { where: { id: id } });
        res.redirect('/admin/palavras-chave');
    } catch (error) {
        console.error('Erro ao atualizar palavra-chave:', error);
        res.redirect('/admin/palavras-chave');
    }
};

exports.postExcluirPalavraChave = async (req, res) => {
    const { id } = req.params;
    try {
        await PalavraChave.destroy({ where: { id: id } });
        res.redirect('/admin/palavras-chave');
    } catch (error) {
        console.error('Erro ao excluir palavra-chave:', error);
        res.redirect('/admin/palavras-chave');
    }
};