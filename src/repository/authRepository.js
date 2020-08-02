const bcrypt = require('bcryptjs')

class AuthRepository {
    constructor(database) {
      this._database = database;
    };

    async registrar(usuario) {
      const senhaEncriptada = await bcrypt.hash(usuario.senha, 8);
      return new Promise((resolve, reject) => {
        this._database.run(
          `INSERT INTO usuarios (nome, sobrenome, email, senha)
          VALUES (?, ?, ?, ?)`,
          [
            usuario.nome,
            usuario.sobrenome,
            usuario.email,
            senhaEncriptada
          ],
          (erro) => {
            if (erro) reject(erro);

            resolve();
          }
        )
      });
    }

    obtemUsuarioPorEmail(email) {
      return new Promise((resolve, reject) => {
        this._database.get(
          `SELECT * 
          FROM usuarios
          WHERE email = ?`,
          email,
          (erro, result) => {
            if (erro) reject(erro);
              
            resolve(result);
          }
        );
      });
    }
}

module.exports = AuthRepository;