import express from 'express';

import * as clienteController from '../controllers/clienteController.js';

import validate from '../middlewares/validate.js';

import { usuarioCreateSchema, usuarioUpdateSchema } from '../controllers/clienteController.js';

//1. Importa o MiddleWare de login.
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


//A rota de criação de cliente é a função post da biblioteca express (registro) continua pública, ou seja, não precisa estar logado para criar uma conta
router.post('/',validate(usuarioCreateSchema), clienteController.adicionarUsuarios);

// '/' define que é um camino na url
// validate(usuarioCreateSchema) verifica se o schema informado pelo usuário, os dados inseridos, batem com o modelo informado no usuarioCreateSchema do arquivo clienteController

// 2. Aplica a proteção do login em todas as rotas abaixo desta linha, porque a partir daqui é só se o usuário estiver logado
router.use(authMiddleware);

// O caminho base '/api/clientes' já foi definido no index.js


router.get('/', clienteController.listarUsuarios); //Rota final: GET /api/cliente

router.put('/:cpf', validate(usuarioUpdateSchema), clienteController.atualizarUsuarios);
//Validaremos os dados inseridos para atualização através do modelo para atualização definido em controller usuarioCreateSchema 

router.delete('/:cpf', clienteController.deletarUsuarios);
export default router;
