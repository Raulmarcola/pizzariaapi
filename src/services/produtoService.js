// produtoService tem a especialidade de criar, consultar, atualizar e remover produto do banco de dados
import db from '../db/db.js';

export const findAll = async (idProduto, nomeProduto, tipo) =>{
    let sql = 'SELECT * FROM produto';
    // definição da consulta base
    const conditions = [];
    // também poderia usar let pois conditions e values serão usadas localmente
    const values = [];
    // é somente por isso que elas ficam de outra cor, por serem constantes e não variáveis
    if(idProduto){
        conditions.push('idProduto = ?');
        values.push(idProduto);
        //Lembrando que a condição e o valor não são passados juntos por uma questão de segurança (SQL Injection)
    };

    if(nomeProduto){
        conditions.push('LOWER(nomeProduto) LIKE ?');
        values.push(`%${nomeProduto.toLowerCase()}%`);
    };

    if(tipo){
        conditions.push('LOWER(descricao) LIKE ?');
        values.push(`%${tipo.toLowerCase()}%`);
        //Exemplo de busca: LOWER(descricao) LIKE %pizza de calabresa, queijo e cebola com borda de catupiry%
    };

    if(conditions.length > 0){
        sql += ' WHERE ' + conditions.join(' AND ');
        //AND deve ser colocado entre parênteses, pois se simplesmente somarmos ele será acrescentado no fim; Fazendo assim, se torna uma junção das condições (conditions.join) em função de AND, ou sej, ir juntando e colocando AND
    };

    const [rows] = await db.query(sql, values);
    return [rows];
};

export const create = async (produtoData) =>{
    const newProduto = {
        ...produtoData
    };

    await db.query('INSERT INTO produto SET ?', newProduto);
    return newProduto;
};

export const update = async (produtoData, idProduto) =>{
    const [result] = await db.query('UPDATE produto SET ? WHERE idProduto = ?', [produtoData, idProduto]);
    return result.affectedRows > 0;
};

export const remove = async (idProduto) =>{
    const [result] = await db.query('DELETE produto WHERE idProduto = ?', [idProduto]);

    return result.affectedRows > 0;
};