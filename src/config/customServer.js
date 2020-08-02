const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./customController')(app);

app.use((req, res, next) => {
  res.status(404).send( {error: true, descricao: 'Path inválido!' } );
});

app.use((erro, req, res, next) => {
  res.status(500).send( {error: true, descricao: erro.message } );
});

module.exports = app;
