const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const path = require('path');
const multer = require('multer');
const upload = multer();

// --- BANCOS DE DADOS ---

require('./src/config/db_mongoose');

const sequelize = require('./src/config/db_sequelize');
require('./src/models/postgres/Aluno');
require('./src/models/postgres/Administrador');
require('./src/models/postgres/Conhecimento');
require('./src/models/postgres/PalavraChave');

sequelize.sync({ force: false }).then(() => {
  console.log('Tabelas do PostgreSQL sincronizadas.');
});

const app = express();

// --- HANDLEBARS ---
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    partialsDir: path.join(__dirname, 'src/views/partials'),
    helpers: { // <-- ADICIONE ESTA SEÇÃO
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/views'));

// --- MIDDLEWARES ---

app.use(express.static(path.join(__dirname, 'src/public')));

app.use(session({
  store: new FileStore({
    path: './sessions',
    logFn: function() {}
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 
  }
} ));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// --- ROTAS DA APLICAÇÃO ---
const authRoutes = require('./src/routes/authRoutes');
const alunoRoutes = require('./src/routes/alunoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const publicRoutes = require('./src/routes/publicRoutes')
const alunoController = require('./src/controllers/alunoController');

app.get('/', (req, res) => {
    res.render('public/home', { 
        pageTitle: 'Portfólio de Engenharia de Software'
    });
});

app.post('/aluno/projetos', upload.none(), alunoController.postCriarProjeto);

app.use(authRoutes);
app.use(alunoRoutes);
app.use(adminRoutes);
app.use(publicRoutes);

module.exports = app;
