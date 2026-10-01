import { json } from 'express';
import * as entregadorService from '../services/entregadorService.js'
//Importamos todas as funções de Service, pois Controller (esse aqui) levará a service e cada função de Controller (esse aqui) está ligada a uma função de Service. Então precisamos dos recursos de service
import Joi from 'joi';
//joi é uma biblioteca de validação de esquemas para javascript

//Exportamos o esquema de criação para torná-lo público, já que routes vai ter interação com o Controler; cada rota levará a uma função de Controller
//Essa função, no caso, será usada para validação, será um objeto (para imitar a tabela do banco de dados) Joi
//Esse é de criação
export const entregadorCreateSchema = Joi.object({
    idEntregador:Joi.number().required(),
    nomeEntregador:Joi.string().max(100).required(),
    telefone:Joi.number().required()
});
//Definimos o formato dos dados no modelo que estão no banco de dados

//Esse é de atualização, então alguns dados não estarão pois não podem ser alterados
export const entregadorUpdateSchema = Joi.object({
    nomeEntregador:Joi.string().max(100),
    telefone:Joi.number()
});

export const listarEntregadores = async (req, res) =>{
    try{
        //Recebe dados pela requisição
        const {idEntregador, nomeEntregador, telefone} = req.query;

        //Processa através da função (no caso, a que faz a busca)
        const entregadores = entregadorService.findAll(idEntregador, nomeEntregador, telefone);

        //Responde um json com os entregadores encontrados
        res.json(entregadores);
    }catch (error){
        console.error('Erro ao listar entregadores: ', error);
        res.status(500).json({error: "Erro interno do servidor"})
    }
};

export const adicionarEntregadores = async (req, res) =>{
    try{
        const novoEntregador = await entregadorService.create(req.body)
        //novoEntregador é o create Entregador a partir da requisição enviada
        res.status(201).json({message: "Entregador adicionado com sucesso", data: novoEntregador})
        //Esse json conterá a mensagem e os dados do novo entregador
    }catch (error){
        console.error('Erro ao adicionar entregador:', error)
        //Sempre haverá o erro mostrado no console e o erro res
        if(error.code === 'ER_DUP_Entry'){
            res.status(400).json({message: "Entregador já cadastrado"});
        }
        res.status(500).json({error: "Erro interno do servidor"})
    }
};

export const atualizarEntregadores = async (req, res) =>{
    try {
        const {idEntregador} = req.params;
        //Definimos que idEntregador é um parâmetro vindo do enpoint da URL

        //A partir dessa constante idEntregador usamos a função update definida no service
        const updated = await entregadorController.update(idEntregador, req.body);
        //Os parâmetros que passamos a ela são o Id e o que vier no corpo da requisição, pois update pega e põe esses valores na query para executar no banco de dados

        if(!updated){
            //Se o updated retornar false é porque no comando sql não foi encontrado no banco
            return res.status(404).json({error: "Entregador não encontrado"});
        }
        res.status(200).json({message: "Entregador atualizado com sucesso"});
    } catch (error) {
        console.error('Erro ao atualizar entregador:', error)
        res.status(500).json({error: "Erro ao atualizar entregador"});
    }
};

export const deletarEntregadores = async (req, res) =>{
    try{
        const {idEntregador} = req.params;
        //idEntregador virá de um parâmetro da url
        const deleted = await entregadorController.remove(idEntregador);
        //Acionamos o remove passando como parâmetro o id que pegamos da url

        if(!deleted){
            return res.status(404).json({error: "Entregador não encontrado"})
        }

        res.status(200).json({message: "Entregador deletado com sucesso"});
        }catch (error){
            console.error("Erro ao deletar cliente:", error)
            res.status(500).json({error: "Erro ao deletar cliente"});
        }
};