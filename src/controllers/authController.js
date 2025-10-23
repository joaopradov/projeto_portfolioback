const Aluno = require('../models/postgres/Aluno');
const Administrador = require('../models/postgres/Administrador');
const bcrypt = require('bcryptjs');

exports.getLoginPage = (req, res) => {
  res.render('auth/login', { pageTitle: 'Login' });
};

exports.postLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await Aluno.findOne({ where: { email } }) || await Administrador.findOne({ where: { email } });

    if (!user) {
      return res.render('auth/login', { pageTitle: 'Login', errorMessage: 'Email ou senha inválidos.' });
    }

    const isPasswordCorrect = await bcrypt.compare(senha, user.senha);

    if (!isPasswordCorrect) {
      return res.render('auth/login', { pageTitle: 'Login', errorMessage: 'Email ou senha inválidos.' });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      id: user.id,
      nome: user.nome || user.nome_completo,
      nome_completo: user.nome_completo || user.nome,
      email: user.email,
      role: user.constructor.name === 'Administrador' ? 'admin' : 'aluno'
    };

    req.session.save(err => {
      if (err) {
        console.error('Erro ao salvar a sessão:', err);
        return res.render('auth/login', { pageTitle: 'Login', errorMessage: 'Ocorreu um erro ao iniciar a sessão.' });
      }

      if (req.session.user.role === 'admin') {
        console.log(`Login de ADMINISTRADOR bem-sucedido: ${req.session.user.email}`);
        return res.redirect('/admin/dashboard');
      } else {
        console.log(`Login de ALUNO bem-sucedido: ${req.session.user.email}`);
        return res.redirect('/aluno/dashboard');
      }
    });

  } catch (error) {
    console.error('Erro no processo de login:', error);
    res.render('auth/login', { pageTitle: 'Login', errorMessage: 'Ocorreu um erro inesperado.' });
  }
};

exports.getLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout: ', err);
            return res.redirect('/');
        }
        res.redirect('/login');
    });
};