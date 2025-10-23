const Projeto = require('../models/mongo/Projeto');
const ConhecimentoAluno = require('../models/mongo/ConhecimentoAluno');
const Conhecimento = require('../models/postgres/Conhecimento')
const PalavraChave = require('../models/postgres/PalavraChave');

exports.getDashboard = (req, res) => {
  res.render('aluno/dashboard', {
    pageTitle: 'Meu Painel',
    user: req.session.user,
  });
};

exports.getGerenciarProjetos = async (req, res) => {
  try {
    const alunoId = req.session.user.id;
    const projetos = await Projeto.find({ desenvolvedores_ids: alunoId }).sort({ createdAt: -1 });

    const palavrasChaveInstances = await PalavraChave.findAll({ order: [['nome', 'ASC']] });
    const todasPalavrasChave = palavrasChaveInstances.map(p => p.get({ plain: true }));

    res.render('aluno/gerenciarProjetos', {
      pageTitle: 'Meus Projetos',
      projetos: projetos,
      todasPalavrasChave: todasPalavrasChave,
    });
  } catch (error) {
    console.error('Erro ao buscar projetos do aluno:', error);
    res.status(500).send('Erro ao carregar a página.');
  }
};

exports.postCriarProjeto = async (req, res) => {
  const { nome, resumo, link_externo, palavras_chave_ids } = req.body;
  const alunoId = req.session.user.id;
  const palavrasChaveIds = Array.isArray(palavras_chave_ids) 
    ? palavras_chave_ids.map(id => parseInt(id, 10)) 
    : [];
  try {
    if (!link_externo || !link_externo.startsWith('http')) {
      req.flash('error', 'Link externo deve ser uma URL válida (ex.: https://github.com/...).');
      return res.redirect('/aluno/projetos');
    }
    await Projeto.create({
      nome,
      resumo,
      link_externo,
      desenvolvedores_ids: [alunoId],
      palavras_chave_ids: palavrasChaveIds,
    });
    req.flash('success', 'Projeto cadastrado com sucesso!');
    res.redirect('/aluno/projetos');
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    req.flash('error', 'Erro ao cadastrar projeto. Verifique os dados e tente novamente.');
    res.redirect('/aluno/projetos');
  }
};

exports.getGerenciarMeusConhecimentos = async (req, res) => {
    const alunoId = req.session.user.id;

    try {
        const todosConhecimentos = await Conhecimento.findAll({ raw: true });
        const meusConhecimentosDoc = await ConhecimentoAluno.findOne({ aluno_id: alunoId });

        let conhecimentosDoAluno = [];

        if (meusConhecimentosDoc && meusConhecimentosDoc.conhecimentos) {
            conhecimentosDoAluno = meusConhecimentosDoc.conhecimentos.map(c => {
                const conhecimentoInfo = todosConhecimentos.find(kc => {
                    return parseInt(kc.id, 10) === parseInt(c.conhecimento_id, 10);
                });

                return {
                    id: c._id,
                    conhecimento_id: c.conhecimento_id,
                    nivel: c.nivel,
                    conhecimento_nome: conhecimentoInfo ? conhecimentoInfo.nome : 'Conhecimento não encontrado', 
                };
            });
        }

        res.render('aluno/gerenciarMeusConhecimentos', {
            pageTitle: 'Meus Conhecimentos',
            todosConhecimentos,
            conhecimentosDoAluno,
        });

    } catch (error) {
        console.error('Erro ao buscar conhecimentos do aluno:', error);
        res.status(500).send('Erro ao carregar a página.');
    }
};

exports.postAdicionarMeuConhecimento = async (req, res) => {
    const { conhecimento_id, nivel } = req.body;
    const alunoId = req.session.user.id;
    const nivelNumerico = parseInt(nivel, 10);

    try {
        const novoConhecimento = {
            conhecimento_id: parseInt(conhecimento_id, 10),
            nivel: nivelNumerico,
        };

        const alunoConhecimentos = await ConhecimentoAluno.findOneAndUpdate(
            { aluno_id: alunoId },

            {
                $set: {

                }
            },

            {
                new: true,
                upsert: true,
            }
        );

        let conhecimentosArray = alunoConhecimentos.conhecimentos || [];
        const index = conhecimentosArray.findIndex(c => c.conhecimento_id === novoConhecimento.conhecimento_id);
        if (index > -1) {
            conhecimentosArray[index].nivel = novoConhecimento.nivel;
        } else {
            conhecimentosArray.push(novoConhecimento);
        }
        alunoConhecimentos.conhecimentos = conhecimentosArray;
        await alunoConhecimentos.save();
        return res.redirect('/aluno/conhecimentos');
    } catch (error) {
        console.error('Erro ao adicionar conhecimento:', error);
        return res.redirect('/aluno/conhecimentos');
    }
};

exports.postRemoverMeuConhecimento = async (req, res) => {
    const conhecimentoIdParaRemover = parseInt(req.params.id, 10);
    const alunoId = req.session.user.id;

    try {
        await ConhecimentoAluno.findOneAndUpdate(
            { aluno_id: alunoId },
            {
                $pull: {
                    conhecimentos: {
                        conhecimento_id: conhecimentoIdParaRemover
                    }
                }
            }
        );

        res.redirect('/aluno/conhecimentos');
    } catch (error) {
        console.error('Erro ao remover conhecimento:', error);
        res.redirect('/aluno/conhecimentos');
    }
};