// clienteService tem a especialidade de criar, consultar, atualizar e remover cliente do banco de dados

import db from '../db/db.js';
import bcrypt from 'bcrypt';

// Lembrando que db é uma variável que recebeu os poderes da biblioteca mysql2 que conecta o node a um banco de dados

// exportar a função findAll pois clienteService é apenas um arquivo especializado que vai fornecer a especialidade dele para outros arquivos
export const findAll = async (cpf, nome, email) => {
    // 1. Define a consulta SQL base (listar todos os clientes)
    // Se ele não passar cpf email e nome vai mostrar todos
    let sql = 'SELECT * FROM usuario';
    // 2. Crie um vetor/array para as condições WHERE
    const conditions = [];
    // 3. Crie um vetor/array para os valores (para impedir SQL Injection)
    const values = [];
    // Adicionando o filtro de cpf
    if (cpf){
        conditions.push('cpf = ?'); // Não se coloca direto o valor ${cpf} na condição
        values.push(cpf); // Lá na frente '?' será substituído pelo valor inserido em cpf
    }
    // Adicionando o filtro de nome
    if (nome){
        conditions.push('LOWER(nome) LIKE ?')
        values.push(`%${nome.toLowerCase()}%`) // Vale lembrar que a % é comando SQL que indica que há mais coisas escritas, se nome = s; %s% pode ser igual a sabrina ou lucas
    }
    // Adicionando o filtro de email
    if (email){
        conditions.push('email = ?');
        values.push(email);
    }

    // 5. Se houver condições, anexa elas à consulta SQL
    if (conditions.length > 0){ //Se há alguma condição
        sql += ' WHERE ' + conditions.join(' AND ');
    };
    // Até aqui tudo virá com ?
    // sql = SELECT * FROM usuario + WHERE nome = ? AND email = ?
    const [rows] = await db.query(sql, values); // query é uma função que pegará sql como o primeiro parâmetro e values como segundo. Ela troca tudo que é ? pelo índice correspondente do vetor values
    return rows; //Retorna um vetor que será o comando do MySQL
}

//async significa uma execução quando é solicitada não de forma sequencial
export const create = async (usuarioData) => { //usuarioData é um objeto/coluna que cada atributo foi informado pelo administrador
    const saltRounds = 10; //Nível de criptografia vai de 4 a 31, 10 é o recomendado
    const hashedPassword = await bcrypt.hash(usuarioData.senha, saltRounds); // Função de criptografar (.hash) a partir da senha, no caso a variável senha cadastrada para usuarioData, e o nível de criptografia, no caso 10 

    const newUsuario = {
        ...usuarioData,
        senha: hashedPassword,
    }; // newUsuario receberá todos os atributos do objeto usuarioData de forma crua, do jeito que foi informado e a senha receberá senha criptografada

    await db.query('INSERT INTO usuario SET ?', newUsuario);

    delete newUsuario.senha; // Jogando fora a senha criptografada
    return newUsuario;
};

export const update = async (cpf, usuarioData) => {
    if (usuarioData.senha) { // Caso ele queira alterar a senha, ou seja, 'senha' for um campo de usuarioData, faz uma criptografia antes da alteração
        const saltRounds = 10;
        usuarioData.senha = await bcrypt.hash(usuarioData.senha, saltRounds);
    }

    const [result] = await db.query('UPDATE usuario SET ? WHERE cpf = ?', [usuarioData, cpf]);
    return result.affectedRows > 0; // para retornar algo só se o usuário realmente alterou
};

export const remove = async (cpf) => {
    const [result] = await db.query('DELETE FROM cliente WHERE cpf = ?', [cpf]); //Maior proteção de dados ao mandar o conteúdo (cpf) separado da string
    return result.affectedRows > 0;
};