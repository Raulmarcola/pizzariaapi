import express from 'express';
//Biblioteca que fronece o routes

import * as entregadorController from '../controllers/entregadorController';

import validate from '../middlewares/validate';

import { entregadorCreateSchema, entregadorUpdateSchema } from '../controllers/entregadorController';
import authMiddleware from '../middlewares/authMiddleware';


const router = express.Router()

router.post('/', validate(entregadorCreateSchema), entregadorController.adicionarEntregadores);

router.use(authMiddleware)
//A execução não é assíncrona (async); é um algoritmo normal, ou seja, a partir daqui usaremos o middleware de autorização
//O efeito disso é que, sem autorização, o usuário pode criar usuário.
//Já para listar, atualizar e deletar é necessária autorização

router.get('/', entregadorController.listarEntregadores);

router.put('/', validate(entregadorUpdateSchema), entregadorController.atualizarEntregadores);

router.delete('/', entregadorController.deletarEntregadores);

export default router;