import express from 'express';
//Importando a biblioteca que fornece o Router
import * as pedidoController from '../controllers/pedidoController.js';
//Faremos a ligação com as funções de pedidoController, então devemos importá-las
import validate from '../middlewares/validate.js';
//Importando para validar os schemas
import {pedidoCreateSchema, pedidoUpdateSchema} from '../controllers/pedidoController.js'
//Importando os modelos de schema definidos em controller a partir do Banco de Dados
const router = express.Router();
//Pegando o elemento Router da npm biblioteca express e atribuindo-o a constante routes

router.post('/', validate(pedidoCreateSchema), pedidoController.adicionarPedidos);

router.get('/', pedidoController.listarPedidos);

router.put('/', validate(pedidoUpdateSchema), pedidoController.listarPedidos);

router.delete('/', pedidoController.deletarPedidos);

//Todas estas coisas O Senhor me deu, não tive que copiar do clienteRoutes

export default router;