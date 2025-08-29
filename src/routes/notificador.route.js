import express from 'express';
const router = express.Router();

//controlador
import { notificadorController } from '../controllers/notificador.controller.js';
import { requireLogin } from '../helpers/services/auth.js';

router.get('/home/notificador/ingreso-plataforma', requireLogin,notificadorController.home);
router.post('/notificador-bot-ti/usuarios-ingresan-hace-una-semana/enam/entidades', requireLogin,notificadorController.index);

export { router };