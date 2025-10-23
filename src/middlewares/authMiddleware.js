const isAuthenticated = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  }
  console.log('Acesso bloqueado: usuário não autenticado. Redirecionando para /login.');
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    console.log('Acesso bloqueado! Usuário não é um administrador!');
    res.status(403).send('Acesso Negado');
};

module.exports = {
    isAuthenticated,
    isAdmin,
};
