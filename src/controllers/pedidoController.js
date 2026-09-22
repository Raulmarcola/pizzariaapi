import pedidoService from '../services//pedidoService.js';
import Joi from 'joi';

export const pedidoCreateSchema = Joi.object({
    formaPagto: Joi.string().required().max(20),
    valorTotal: Joi.number().required(),
    idEntregador: Joi.number().required(),
    cpf: Joi.string().required().length(11),
    statusPedido: Joi.string().required().max(20),
    formaEntrega: Joi.string().required().max(15)
});

export const pedidoUpdateSchema = Joi.object({
    formaPagto: Joi.string().max(20),
    valorTotal: Joi.number(),
    idEntregador: Joi.number(),
    cpf: Joi.string().length(11),
    statusPedido: Joi.string().max(20),
    formaEntrega: Joi.string().max(15)
});
