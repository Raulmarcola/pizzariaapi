import express from 'express';
//Biblioteca que fronece o routes

import * as entregadorController from '../controllers/entregadorController.js'

import validate from '../middlewares/validate.js';

import { entregadorCreateSchema, entregadorUpdateSchema } from '../controllers/entregadorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router()

router.use(authMiddleware)

router.post('/', validate(entregadorCreateSchema), entregadorController.adicionarEntregadores);

router.get('/', entregadorController.listarEntregadores);

router.put('/', validate(entregadorUpdateSchema), entregadorController.atualizarEntregadores);

router.delete('/', entregadorController.deletarEntregadores);

export default router;