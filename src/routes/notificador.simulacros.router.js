import express from 'express';
const router = express.Router();

//controlador
import { notificadorSimulacrosController  } from '../controllers/notificador.simulacros.controller.js';

router.get('/home/simulacros/examen-programado', notificadorSimulacrosController.home);
router.post('/notificador-bot-ti/usuarios-examen-programado-apertura/enam/simulacros', notificadorSimulacrosController.index);

export { router };