import produtoService from '../services/pedidoService.js';
import Joi from 'joi';

export const produtoCreateSchema = Joi.object({
    idProduto: Joi.number().required(),
    nomeProduto: Joi.string().required().max(30),
    descricao: Joi.string().required().max(100),
    tipo: Joi.string().required().max(20),
    valor: Joi.number().required(),
    imagem: Joi.string().max(200).allow('')
});

export const produtoUpdateSchema = Joi.object({
    nomeProduto: Joi.string().max(30),
    descricao: Joi.string().max(100),
    tipo: Joi.string().max(20),
    valor: Joi.number(),
    imagem: Joi.string().max(200)
});
