import express from 'express';
import morgan from 'morgan';
import { create } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//cargandr las variables de entorno
dotenv.config();

//importacion de rutas
import { router as index } from './routes/index.router.js';
import { router as notificador } from './routes/notificador.route.js';
import { router as notificadorCientifica } from './routes/notificador.simulacros.router.js';
import { router as notificadorSoporte } from './routes/notificador.soporte.route.js';


//inicializar
const app = express();

//para las sessiones del usuario
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // para https(true)
}));

//configuracion de puerto
app.set('port', process.env.PORT || 4000);

//configuracion de la plantilla 
app.set('views', path.join(__dirname, 'views'));
const hbs = create({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs')

//configuracion de la carpeta public
app.use(express.static(path.join(__dirname, 'public')))
console.log('Direccion public' + path.join(__dirname, 'public'));

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//rutas generales
app.use('', index);
app.use('', notificador);
app.use('', notificadorCientifica);
app.use('', notificadorSoporte);

//correr servidor
app.listen(app.get('port'), () => console.log('server lisening on port: ', app.get('port')));
