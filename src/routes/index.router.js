import express from 'express';
const router = express.Router();

import { indexController } from '../controllers/index.controller.js';

router.get('/', indexController.login);
router.get('/home/banquea', indexController.index);

export { router };