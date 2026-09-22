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

export const listarProdutos = async (req, res) =>{
    try {
        // Fornecemos acima o formato e nome dos dados que serão inseridos e armazenados
        // Agora criar funções a partir deles; a partir da requisição (req.query)
        const{ idProduto, nomeProduto, tipo } = req.query;
        // Passamos para o service
        const clientes = await produtoService.findAll(idProduto, nomeProduto, tipo);
        
        res.json(clientes);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({error: 'Erro interno do servidor'})
    }
};

export const adicionarProdutos = async (req, res) =>{
    try{
        const novoProduto = await produtoService.create(req.body);
        // AdicionarProdutos é uma função que recebe como parâmetro requisição da url. 
        // Criamos uma variável novoProduto que aciona o create a partir de req.body que seria um json com os dados do novo cliente
        res.status(201).json({message: 'Produto adicionado com sucesso.', data: novoProduto});
        // Ele enviará a resposta em dois formatos:
        // status que será 201 (sucesso)
        // e um json que mostra a mensagem 'Produto adicionado...' e os respectivos dados 'data': variável que recebe body
    } catch{
        console.error('Erro ao adicionar produto', err);
        if(err.code === 'ER_DUP-Entry'){
            return res.status(409).json({error: 'Produto já registrado.'})
        }
        res.status(500).json({error:'Erro ao adicionar produto.'})
    }
};

export const atualizarProdutos = async (req, res) =>{
    try{
        const {idProduto} = req.params;
        //idProduto é um objeto que receberá os parâmetros da requisição
        const updated = await produtoService.update(idProduto, req.body);
        //updated recebe a função update que vai colocar idProduto como um parâmetro para identificar qual produto deve ser alterado e recebe a req.body que define como ficará

        if(!updated){ //Verificará em cada idProduto da tabela produto se o recebido é igual. Caso for diferente o produto não existe
            return res.status(404).json({error: 'Produto não encontrado'});
            //404 - Sua pergunta não faz sentido
        }
        res.status(200).json({message: 'Produto atualizado com sucesso.'});
        //200 - A pergunta faz sentido e eu sei a resposta
    } catch{
        console.error('Erro ao atualizar produto:', err);
        res.status(500).json({error: 'Erro ao atualizar produto:'})
        //500 - Não sei a resposta
    }
};

export const deletarProduto = async (req, res) =>{
    try{
        const {idProduto} = req.params
        //Definido idProduto como informado nos parâmetros. É necessário saber o Id para deletar um produto
        const deleted = await produtoService.remove(idProduto);
        // Não é necessário req.body, pois nada será informado apenas dizemos através do id o produto que será excluído e a ação é executada por meio da função remove, definida em produtoService
        // CONTROLLER CHAMA O SERVICE, service trabalha para o controller
        if(!deleted){
            return res.status(404).json({error: 'Produto não encontrado'});
            // se deleted for diferente de tudo que há, não encontramos o produto!
        }
        res.status(200).json({message: 'Produto deletado com sucesso'});

    } catch{
        console.error('Erro ao deletar cliente', err);
        res.status(500).json({error: 'Erro ao deletar produto'})
    };
};