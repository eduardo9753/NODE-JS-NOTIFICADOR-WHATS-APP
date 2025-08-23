const indexController = {};

indexController.login = (req,res ) => {
    res.render('login/index.hbs');
}

indexController.index = (req, res) => {
    res.render('home/index.hbs');
}

export { indexController };