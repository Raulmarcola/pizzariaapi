import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/', authController.login);
//Somente a rota do método post porque autentificação só vai adicionar;

export default router;