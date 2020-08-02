class CategoriasRepository {
  constructor(database) {
    this._database = database;
  };

  listar() {
    return new Promise((resolve, reject) => {
      this._database.all(
        `SELECT A.id
               ,A.nome
               ,A.usuario_id AS usuario_id
               ,B.nome AS usuario_nome
               ,B.sobrenome AS usuario_sobrenome
         FROM categorias AS A
              INNER JOIN usuarios AS B ON A.usuario_id = B.id
        `,
        (erro, result) => {
          if (erro) reject(erro);

          resolve(result);
        }
      );
    })
  };

  obterCategoriaPorId(id) {
    return new Promise((resolve, reject) => {
      this._database.get(
        `SELECT A.id
               ,A.nome
               ,A.usuario_id AS usuario_id
               ,B.nome AS usuario_nome
               ,B.sobrenome AS usuario_sobrenome
         FROM categorias AS A
              INNER JOIN usuarios AS B ON A.usuario_id = B.id
         WHERE A.id = ?
        `,
        id,
        (erro, result) => {
          if (erro) reject(erro);
  
          resolve(result);
        }
      );
    });
  };

  obterCategoriaPorNome(nome) {
    return new Promise((resolve, reject) => {
      this._database.get(
        `SELECT A.id
               ,A.nome
               ,A.usuario_id AS usuario_id
               ,B.nome AS usuario_nome
               ,B.sobrenome AS usuario_sobrenome
         FROM categorias AS A
              INNER JOIN usuarios AS B ON A.usuario_id = B.id
         WHERE A.nome = ?
        `,
        nome,
        (erro, result) => {
          if (erro) reject(erro);
  
          resolve(result);
        }
      );
    });
  }

  registrar(categoria, userId) {
    return new Promise((resolve, reject) => {
      this._database.run(
        `INSERT INTO categorias (nome, usuario_id)
        VALUES (?, ?)`,
        [
          categoria.name,
          userId,
        ],
        (erro) => {
          if (erro) reject(erro);

          resolve();
        }
      );
    });
  };

  atualizar(categoria, userId) {
    return new Promise((resolve, reject) => {
      this._database.run(
        `UPDATE categorias
         SET nome = ?
            ,usuario_id = ?
         WHERE id = ?`,
        [
          categoria.name,
          userId,
          categoria.id
        ],
        (erro) => {
          if (erro) reject(erro);

          resolve();
        }
      );
    });
  }


}

module.exports = CategoriasRepository;
