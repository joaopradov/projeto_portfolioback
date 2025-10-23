const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/aluno/dashboard', isAuthenticated, alunoController.getDashboard);

router.get('/aluno/projetos', isAuthenticated, alunoController.getGerenciarProjetos);
router.post('/aluno/projetos', isAuthenticated, alunoController.postCriarProjeto);

router.get('/aluno/conhecimentos', isAuthenticated, alunoController.getGerenciarMeusConhecimentos);
router.post('/aluno/conhecimentos', isAuthenticated, alunoController.postAdicionarMeuConhecimento);
router.post('/aluno/conhecimentos/delete/:id', isAuthenticated, alunoController.postRemoverMeuConhecimento);

module.exports = router;