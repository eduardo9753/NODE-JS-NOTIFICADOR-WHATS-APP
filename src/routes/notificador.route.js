import express from 'express';
const router = express.Router();

//controlador
import { notificadorController } from '../controllers/notificador.controller.js';

router.get('/home/notificador/ingreso-plataforma', notificadorController.home);
router.post('/notificador-bot-ti/usuarios-ingresan-hace-una-semana/enam/entidades', notificadorController.index);

export { router };