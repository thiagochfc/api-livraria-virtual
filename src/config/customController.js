module.exports = app => {
    require('../controller/authController')(app)
    require('../controller/categoriasController')(app)
}
