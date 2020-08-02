const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('database.db');

const USUARIOS_SCHEMA = `
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL,
    sobrenome VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
)
`;

database.serialize(() => {
    database.run("PRAGMA foreign_keys=ON");
    database.run(USUARIOS_SCHEMA);
})

process.on('SIGINT', () =>
    database.close(() => {
        console.log('BD encerrado!');
        process.exit(0);
    })
);

module.exports = database;
