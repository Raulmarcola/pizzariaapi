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
        res.ststus(500).json({error: 'Erro Interno do servidor'})
    }
};

export const adicionarUsuarios = async () => {
    
};

export const atualizarUsuarios = async () => {

};

export const deletarUsuarios = async () => {

};
// try e catch são uma construção de tentar executar um conjunto de instruções e se der errado faça isso