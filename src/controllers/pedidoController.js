import * as pedidoService from '../services//pedidoService.js';
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

export const listarPedidos = async (req, res) =>{
    try{
        const {idPedido, statusPedido, cpf} = req.query;
        //O objeto idPedido, statusPedido, cpf será definido a partir do que vier na requisição
        const pedidos = await pedidoService.findAll(idPedido, statusPedido, cpf);
        //listarPedidos está ligado à função findAll de service, está chamando ela
        //findAll recebe três parâmetros na sua definição e agora estamos passando eles (idPedido, statusPedido, cpf); Ele fará a busca a partir destas variáveis provenientes da url
        res.json(pedidos);
        //Neste caso, a resposta json nem será o status mas será a própria constante pedidos no formato json (objeto)
    }catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        //Erro que aparecerá no console caso o try der errado (string + variável de erro err)
        res.status(500).json({error:'Erro interno no servidor'})
        //A resposta vem em duas forms o status 500 de erro interno e a mensagem em texto em formato json
    }
};

export const adicionarPedidos = async (req, res) =>{
    try{
        const novoPedido = await pedidoService.create(req.body);
        //Assim como no listarPedido tinha feito uma constante que recebe requisição (no caso .body) e uma outra constante que recebe a função em função da constante 1. Mas é mais adequado fazer direto: novoPedido recebe pedidoService.create(req.body)

        res.status(201).json({message: 'Pedido adicionado com sucesso.', data: novoPedido});
    }catch (err) {
        console.error('Erro ao adicionar pedido:', err);
        //No caso do adicionar, ainda há outro tipo de erro: o pedido já existir
        if (err.code === 'ERR_DUP_Entry'){
            return res.status(409).json({error: 'Pedido já registrado'})
        };
        res.status(500).json({error: 'Erro ao adicionar pedido.'});
    }
};

export const atualizarPedidos = async (req, res) =>{
    try{
        const {idPedido} = req.params;
        // idPedido Recebe parâmetro de req
        const updated = await pedidoService.update(idPedido, req.body);
        //Chamando a função update e passando a ela como parâmetro idPedido definido na linha anterior para que ela encontre qual pedido atualizar e req.body que conterá os dados atualizados
        if(!updated){
            res.status(404).json({error: 'Pedido não encontrado'});
        }
        //Se não houver um idPedido igual, o pedido não será encontrado - é o erro oposto que existe no create, pois nesse passo não pode haver um idPedido igual
        res.status(200).json({message: 'Pedido atualizado com sucesso.'})
    }catch (err) {
        // O sistema vai retornar um erro 'err' e passamos ele como um parâmetro no catch para ser exibido
        console.error('Erro ao atualizar pedido:', err)
        res.status(500).json({error: 'Erro ao atualizar pedido.'})
    }
}

//As funções do contoller que chamam as funções de update tem sempre essa estrutura de try e catch:
// Tente definir uma constante que chama a função de controller relacionada e fornece os parâmetros a partir de url; caso dê certo emita resposta com status 200. Se não der certo, responda o erro através do console, status e json

export const deletarPedidos = async (req, res) =>{
    try{
        const idPedido = req.params;

        const  deleted = await pedidoService.remove(idPedido)

        if(!deleted){
            res.status(404).json({error: 'Pedido não encontrado.'})
        }
        //Não precisa fazer com else
        res.status(200).json({message: 'Pedido deletado com sucesso.'})
    }catch (err) {
        console.error('Erro ao deletar pedido: ', err)
        res.status(500).json({error: 'Erro ao deletar pedido.'})
    }
};
//ANOTAÇÕES DO DIA:

//Front-End Chama o Index, Index chama o Routes, Routes chama o Controller, Controller chama o Service e o Service chama o Banco de Dados.

//Assim se liga o Front-End com o Banco de Dados

//Todas essas ligações são feitas através das funções que são exportadas e importadas entre os arquivos; Ou seja esses pedaços dos arquivos se tornam públicos e podem ser usados por aqueles que o importam. Isso é o 'chamar'

//Então index tem uma função do routes, que é composta por uma função do controller que é composta por uma função de service que é composto por uma função da biblioteca npm mysql2. Essa é a nossa API!!

// Toda a Glória a Jesus! Toda a honra a Jesus!
// Toda a Glória a Jesus! Seu santo nome vamos exaltar!

//Que legal! Glória a Deus!