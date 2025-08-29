import { generateAccessToken } from "../helpers/services/auth.js";

const indexController = {};

indexController.login = (req, res) => {
    res.render('login/index.hbs');
}

indexController.auth = (req, res) => {
    const { email, password } = req.body;
    console.log('datos login: ', req.body);

    //consultamos a la API que vas a construir en laravel y extraer los datos
    //const user = { email: email };
    //const accessToken = generateAccessToken(user);

    // Aquí validas contra tu BD (ejemplo simple)
    if (email === "anthony.anec@gmail.com" && password === "123456") {
        // Guardamos el usuario en sesión
        req.session.user = { email: email, role: "admin" };
        return res.json({
            message: 'Credenciales Correctas, Bienvenido :)',
            type: 1 //no autorizado
        });
    } else {
        res.json({
            message: 'Credenciales Incorrectas',
            type: 0 //no autorizado
        });
    }
}

indexController.index = (req, res) => {
    res.render('home/index.hbs');
}


indexController.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

export { indexController };