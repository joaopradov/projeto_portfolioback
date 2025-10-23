const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const adminOnly = [isAuthenticated, isAdmin];

router.get('/admin/dashboard', adminOnly, adminController.getDashboard);

router.get('/admin/alunos', adminOnly, adminController.getGerenciarAlunos);
router.post('/admin/alunos', adminOnly, adminController.postCriarAluno);
router.post('/admin/alunos/delete/:id', adminOnly, adminController.postExcluirAluno);
router.get('/admin/alunos/edit/:id', adminOnly, adminController.getEditarAluno);
router.post('/admin/alunos/edit/:id', adminOnly, adminController.postEditarAluno);

router.get('/admin/conhecimentos', adminOnly, adminController.getGerenciarConhecimentos);
router.post('/admin/conhecimentos', adminOnly, adminController.postCriarConhecimento);
router.get('/admin/conhecimentos/edit/:id', adminOnly, adminController.getEditarConhecimento);
router.post('/admin/conhecimentos/edit/:id', adminOnly, adminController.postEditarConhecimento);
router.post('/admin/conhecimentos/delete/:id', adminOnly, adminController.postExcluirConhecimento);

router.get('/admin/palavras-chave', adminOnly, adminController.getGerenciarPalavrasChave);
router.post('/admin/palavras-chave', adminOnly, adminController.postCriarPalavraChave);
router.get('/admin/palavras-chave/edit/:id', adminOnly, adminController.getEditarPalavraChave);
router.post('/admin/palavras-chave/edit/:id', adminOnly, adminController.postEditarPalavraChave);
router.post('/admin/palavras-chave/delete/:id', adminOnly, adminController.postExcluirPalavraChave);

module.exports = router;