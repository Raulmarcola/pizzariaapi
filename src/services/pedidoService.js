import db from '../db/db.js';
import bcrypt from 'bcrypt';

export const findAll = async (idPedido, cpf, statusPedido) => {
    // define-se a variável sql como a consulta base de selecionar todos
    let sql = 'SELECT * FROM pedido';
    // o vetor conditions armazena somente se há uma sentença envolvendo algum dos parâmetros passados
    const conditions = [];
    // o vetor values guarda os valores passados, a fim de fazer a pesquisa
    const values = [];
    // adicionando o filtro de idPedido
    if(idPedido){
        conditions.push('idPedido = ?');
        values.push(idPedido);
    }
    // condicional 'Se houver pedido' adicione id pedido = ? às condições e o valor inserido  em values
    // depois, '?' será subtituído pelo parâmetro idPedido

    if(cpf){
        conditions.push('cpf = ?');
        values.push(cpf);
    }

    if(statusPedido){
        conditions.push('LOWER(statusPedido) LIKE ?');
        // Por ser um texto é usado Lower para padronizar e LIKE; 
        values.push(`%${statusPedido.toLowerCase()}%`);
        // toLowerCase para deixar minúsculo e as '%' são comandos SQL que indicam que pode haver mais caracteres
    }

    if(conditions.length > 0){
        sql += ' WHERE ' + conditions.join(' AND ')
        // Caso haja condições, some a consulta base com a jução das condições inseridas
        // WHERE e AND são comandos necessários para a sintaxe correta no MySQL
    }

    const [rows] = await db.query(sql, values);
    //Isso executa a consulta
    return rows;
    //Assim, a função findAll recebe as chaves como parâmetro e as devolve em formato de consulta SQL
};

export const create = async (pedidoData) =>{
    const newPedido = {
        ...pedidoData
    };

    await db.query('INSERT INTO pedido SET ?', newPedido);
    return newPedido;
};

export const update = async (idPedido, pedidoData) =>{
    const [result] = await db.query('UPDATE pedido SET ? WHERE idPedido = ?', [pedidoData, idPedido]);
    //A query executará o comando acima substituindo o 1º '?' pelos dados e o segundo pelo id do pedido que se quer atualizar
    return result.affectedRows > 0;
};

export const remove = async (idPedido) =>{
    const [result] = await db.query('DELETE pedido WHERE idPedido = ?', [idPedido]);

    return result.affectedRows > 0;
};