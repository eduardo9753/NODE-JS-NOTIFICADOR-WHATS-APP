import express, { Router } from 'express';
const router = express.Router();

import { indexController } from '../controllers/index.controller.js';
import { requireLogin } from '../helpers/services/auth.js';

router.get('/', indexController.login);
router.post('/auth', indexController.auth);
router.get('/home/banquea', requireLogin, indexController.index);
router.get('/logout', indexController.logout);

export { router };