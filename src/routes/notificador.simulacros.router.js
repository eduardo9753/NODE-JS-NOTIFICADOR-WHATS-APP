import express from 'express';
const router = express.Router();

//controlador
import { notificadorSimulacrosController } from '../controllers/notificador.simulacros.controller.js';
import { requireLogin } from '../helpers/services/auth.js';

router.get('/home/simulacros/examen-programado', requireLogin, notificadorSimulacrosController.home);
router.post('/notificador-bot-ti/usuarios-examen-programado-apertura/enam/simulacros', requireLogin, notificadorSimulacrosController.index);

export { router };