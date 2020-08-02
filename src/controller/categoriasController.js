const express = require('express');
const router = express.Router();
const database = require('../config/database_sqlite3');
const authMiddleware = require('../middleware/authMiddleware')
const CategoriasRepository = require('../repository/categoriasRepository');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const categoriasRepository = new CategoriasRepository(database);
  try {
    const categorias = await categoriasRepository.listar();
    if (categorias)
      res.status(200).send({ categorias });
    else 
      res.status(200).send({});
  } catch (erro) {
    res.status(400).send({ error: true, descricao: erro.message });
  }
})

router.get('/:id', async (req, res) => {
  const categoriasRepository = new CategoriasRepository(database);
  try {
    const categoria = await categoriasRepository.obterCategoriaPorId(req.params.id);
    if (categoria)
      res.status(200).send(categoria);
    else 
      res.status(200).send({});
  } catch (erro) {
    res.status(400).send({ error: true, descricao: erro.message });
  }
})

router.post('/', async (req, res) => {
  const categoriasRepository = new CategoriasRepository(database);
  try {
    const categoria = await categoriasRepository.obterCategoriaPorNome(req.body.nome);

    if (categoria !== null) throw new Error('Categoria já cadastrada!');

    await categoriasRepository.registrar(req.body, req.userId);

    res.status(200).send({ created: true, categoria: req.body });
  } catch (erro) {
    res.status(400).send({ error: true, descricao: erro.message });
  }
})

router.put('/', async (req, res) => {
  const categoriasRepository = new CategoriasRepository(database);
  try {
    const categoria = await categoriasRepository.obterCategoriaPorId(req.body.id);

    if (!categoria) throw new Error('Categoria não existe!');

    await categoriasRepository.atualizar(req.body, req.userId);
    res.status(200).send({ updated: true, categoria: req.body });
  } catch (erro) {
    res.status(400).send({ error: true, descricao: erro.message });
  }
})

module.exports = app => app.use('/categorias', router);
