import express from 'express';
const router = express.Router();

//controlador
import { notificadorSoporteController } from '../controllers/notificador.soporte.controller.js';
import { requireLogin } from '../helpers/services/auth.js';

router.get('/home/soporte/banquea', requireLogin, notificadorSoporteController.home);
router.post('/notificador-bot-ti/soporte-banquea', requireLogin, notificadorSoporteController.index);

export { router };