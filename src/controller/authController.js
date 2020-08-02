const express = require('express');
const router = express.Router();
const database = require('../config/database_sqlite3');
const AuthRepository = require('../repository/authRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const authConfig = require('../config/auth.json')

const messageError = function(res, code, error, descricao) {
    res.status(code).send({ error: error, descricao: descricao });
}

const messageSuccess = function(res, code, obj) {
    res.status(code).send(obj);
}

const generateToken = function(obj) {
    return jwt.sign(obj, authConfig.secret, { expiresIn: 84600 });
}

router.post('/register', async (req, res) => {
    const authRepository = new AuthRepository(database);
    const { email } = req.body;
    try {
        const user = await authRepository.obtemUsuarioPorEmail(email);

        if (user) throw new Error("Usuário já está cadastrado.");
        
        await authRepository.registrar(req.body);

        const { id } = await authRepository.obtemUsuarioPorEmail(email);

        messageSuccess(res, 200, { email: email, token: generateToken({ id: id })});
    }
    catch (erro) {
        messageError(res, 400, "Erro ao registrar um usuário!", erro.message);
    }
});

router.post('/authenticate', async (req, res) => {
    const authRepository = new AuthRepository(database);
    const { email, senha } = req.body;
    try {
        const user = await authRepository.obtemUsuarioPorEmail(email);

        if (!user) throw new Error("Usuário não cadastrado.");

        if (!await bcrypt.compare(senha, user.senha)) throw new Error("A senha está incorreta.");

        messageSuccess(res, 200, { email: user.email, token: generateToken({ id: user.id })});

    } catch(erro) {
        messageError(res, 400, "Erro ao autenticar o usuário!", erro.message);
    }
});


module.exports = app => app.use('/auth', router);
