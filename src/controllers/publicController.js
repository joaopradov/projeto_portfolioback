const Projeto = require('../models/mongo/Projeto');
const ConhecimentoAluno = require('../models/mongo/ConhecimentoAluno');
const Aluno = require('../models/postgres/Aluno');
const Conhecimento = require('../models/postgres/Conhecimento');
const PalavraChave = require('../models/postgres/PalavraChave');

exports.getListarProjetos = async (req, res) => {
  try {
    const { palavra_chave_id } = req.query;

    const queryMongo = {};
    if (palavra_chave_id) {
      queryMongo.palavras_chave_ids = palavra_chave_id;
    }

    const projetosMongo = await Projeto.find(queryMongo).sort({ createdAt: -1 });
    const alunosPostgresInstances = await Aluno.findAll({ attributes: ['id', 'nome_completo'] });
    const palavrasChaveInstances = await PalavraChave.findAll({ order: [['nome', 'ASC']] });
    const alunosPostgres = alunosPostgresInstances.map(a => a.get({ plain: true }));
    const todasPalavrasChave = palavrasChaveInstances.map(p => p.get({ plain: true }));

    const projetos = projetosMongo.map(projeto => {
      const desenvolvedores = projeto.desenvolvedores_ids.map(id => {
        return alunosPostgres.find(aluno => aluno.id === id);
      }).filter(dev => dev);

      return {
        ...projeto.toObject(),
        desenvolvedores: desenvolvedores,
      };
    });

    const filtroAtivo = palavra_chave_id 
      ? todasPalavrasChave.find(p => p.id == palavra_chave_id) 
      : null;

    res.render('public/listarProjetos', {
      pageTitle: 'Projetos',
      projetos: projetos,
      todasPalavrasChave: todasPalavrasChave,
      filtroAtivo: filtroAtivo,
    });
  } catch (error) {
    console.error('Erro ao buscar todos os projetos:', error);
    res.status(500).send('Erro ao carregar a página de projetos.');
  }
};

exports.getRelatorioConhecimentos = async (req, res) => {
    try {
        const totalAlunos = await Aluno.count();
        const conhecimentos = await Conhecimento.findAll({ raw: true });
        const relatorio = [];

        for (const conhecimento of conhecimentos) {

            const conhecimentoIdNumerico = parseInt(conhecimento.id, 10);

            const alunosComConhecimento = await ConhecimentoAluno.countDocuments({
                'conhecimentos.conhecimento_id': conhecimentoIdNumerico,
            });

            const porcentagem = totalAlunos > 0 ? (alunosComConhecimento / totalAlunos) * 100 : 0;

            relatorio.push({
                nome: conhecimento.nome,
                descricao: conhecimento.descricao,
                alunosComConhecimento,
                totalAlunos,
                porcentagem: porcentagem.toFixed(1),
                larguraBarra: Math.min(porcentagem, 100),
            });
        }

        res.render('public/relatorioConhecimentos', {
            pageTitle: 'Relatório de Conhecimentos',
            relatorio,
        });

    } catch (error) {
        console.error('Erro ao gerar relatório de conhecimentos:', error);
        res.status(500).send('Erro ao gerar relatório.');
    }
};
