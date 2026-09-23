//usamos 'import * as'para agrupar todas as exportações de service.
import * as clienteService from '../services/clienteService.js'
import Joi from 'joi';

//Usando 'export const' para criar e exportar a função
//Criação dos schemas que o validate irá usar para validar dados do usuário
export const usuarioCreateSchema = Joi.object({
    cpf: Joi.string().required().length(11),
    nome: Joi.string().required().max(100),
    endereco: Joi.string().required().max(100),
    bairro: Joi.string().allow('').max(30),
    cidade: Joi.string().allow('').max(30),
    cep: Joi.string().required().length(8),
    telefone: Joi.string().required().max(13),
    email: Joi.string().required().max(50),
    senha: Joi.string().required().max(100),
    tipo: Joi.string().required().max(10)
});
// Aqui se define o modelo de dados que serão recebidos 

// colocar somente os dados passíveis de alteração
export const usuarioUpdateSchema = Joi.object({
    nome: Joi.string().max(100),
    endereco: Joi.string().max(100),
    bairro: Joi.string().max(30),
    cidade: Joi.string().max(30),
    cep: Joi.string().length(8),
    telefone: Joi.string().max(13),
    email: Joi.string().max(50),
    senha: Joi.string().max(100)
});

export const listarUsuarios = async (req, res) => {
    try{
        //Capturamos os parâmetros de consulta URL
        //exemplo: ?cpf=01234567890 / ?nome=sandro / ?email=sandro@senac.br
        const { cpf, nome, email } = req.query;
        //Passamos todos os filtros para o serviço
        const clientes = await clienteService.findAll(cpf, nome, email);
        //Lista vazia é uma resposta válida: 200 com []
        res.json(clientes);
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({error: 'Erro Interno do servidor'})
    }
};

export const adicionarUsuarios = async (req, res) => {
    try{
        const novoUsuario = await clienteService.create(req.body);
        // cada função de controller estará ligada a uma função de service
        // adicionarUsuarios está ligado a create
        res.status(201).json({message: 'Cliente adicionado com sucesso', data: novoUsuario});
    }catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        if (err.code === 'ER_DUP_Entry'){
            return res.status(409).json({error: 'CPF já cadastrado.'})
        }
        res.status(500).json({Error: 'Erro ao adicionar cliente'});
    }
};

export const atualizarUsuarios = async (req, res) => {
    try {
        const {cpf} = req.params;
        const updated = await clienteService.update(cpf, req.body);
        if (!updated){
            return res.status(404).json({error: 'Cliente não encontrado'});
        }
        res.status(200).json({message: 'Cliente atualizado com sucesso'});
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
        res.status(500).json({error: 'Erro ao atualizar cliente'});
    }
};

export const deletarUsuarios = async (req, res) => {
    try{
        const {cpf} = req.params;
        //definimos que cpf é um dado que virá na requisição, o admin vai informar o cpf do user a ser deletado
        const deleted = await clienteService.remove(cpf);
        // deleted será a função remove do arquivo clienteService a partir do cpf informado
        if (!deleted){
            return res.status(404).json({error: 'Cliente não encontrado'});
            // Se deleted for diferente de todos os cpf existentes, erro ao informar o cpf
        }
        res.status(200).json({message: 'Cliente deletado com sucesso'});
    } catch (err) {
        console.error('Erro ao deletar cliente:', err);
        res.status(500).json({error: 'Erro ao deletar cliente'});
    }
};
// try e catch são uma construção de tentar executar um conjunto de instruções e se der errado faça isso