import express from 'express';

import * as produtoController from '../controllers/produtoController.js';
//Chamando o controller; Fazendo uma das ligações da nossa API

import validate from '../middlewares/validate.js';

import { produtoCreateSchema, produtoUpdateSchema } from '../controllers/produtoController.js';

const router = express.Router();

//Através do router, faremos as rotas de cada método http que pode ser usado. Cada Método HTTP está ligado a uma função de controller e cada função de controller está ligada a uma função de service. Da seguinte maneira:

router.post('/', validate(produtoCreateSchema), produtoController.adicionarProdutos)
//Método post está ligado a adicionarProdutoS, pois essa é a função dele postar = adicionar.
//adicionarProdutos, por sua vez, lá no arquivo produtoController, está ligado à função create do produtoService

//Aleluia

router.get('/', produtoController.listarProdutos);
//Método get está ligado a listagem de produtos (função listarProdutos).
//Dentro da função listarProdutos há a ligação com a função findAll de service

router.put('/', validate(produtoUpdateSchema), produtoController.atualizarProdutos);
//Por isto fizemos a cópia da tabela do banco de dados através da biblioteca joi no arquivo de Controller: para validar o recebimento de dados. Tanto para atualização, quanto para criação
//Método put é para atualização, então ligamos ele com a função atualizarProdutos
//Ela fornecerá as requisições e as respostas, os parâmetros para a service de update (produtoService.update) 
//Essa, sim, contém os códigos que executam uma Atualização no banco de dados!!

router.delete('/', produtoController.deletarProdutos)
//O método delete se ligará à função deletarProdutos
// deletarProdutos chama remove que fará a exclusão de um produto do banco de dados através da biblioteca mysql2

export default router;
