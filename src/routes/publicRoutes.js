const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/projetos', publicController.getListarProjetos);

router.get('/relatorio', publicController.getRelatorioConhecimentos);

module.exports = router;