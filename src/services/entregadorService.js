//Iniciando a integração com a tabela entregador pelo Service pois é o último na ordem da API, depois controller e depois routes
//Pois routes usa funções de controller, controller usa funções de service e service usa o db. Logo, devemos começar pelo Service que é o único que não usa recursos dos outros, independente

import db from "../db/db";
//Importando a variável db que tem os poderes da biblioteca mysql, pois o service é o arquivo que tem contato direto com o Banco de Dados, última parte da API, termina a interação entre cliente e database

export const findAll = async (idEntregador, nomeEntregador, telefone) =>{
    let sql = ' SELECT * FROM entregador ';
    //Escrevendo a consulta base do mysql que vai ter partes acrescentadas ou não depende dos parâmetros
    const conditions = []; // Guardará as consultas
    const values = []; //Guardará os valores

    //Montando as especificações do comando sql a partir dos parâmetros passados
    if(idEntregador){
        //Se houver chegado algo em idEntregador,  
        conditions.push(' idEntregador = ?'); //adicione a string 'idEntregador = ?' ao vetor das condições
        values.push(idEntregador); //e adiciona o valor que chegar em values
    }

    if(nomeEntregador){
        conditions.push(' LOWER(nomeEntregador) LIKE ?');
        values.push(`%${nomeEntregador.toLowerCase()}%`); 
        //Uso de crases e ${} para impressão de variável é necessário para acrescentar os '%', afinal nome é uma string e talvez 
    }

    if(telefone){
        conditions.push(' telefone = ?');
        values.push(telefone); //Lembrando que lá na frente, '?' será substituído pelo que estiver na variável telefone
    }

    if (conditions.length > 0){ //Tamanho do vetor conditions for maior que zero
    //Se houver alguma condição, se algum parâmetro foi passado à função:
        sql += ' WHERE ' + conditions.join(' AND ');
        //Juntando a consulta às condições, colocando WHERE e juntando (join) os índices do vetor conditions colocando AND
        //Até aqui ficará (é um exemplo, pode ser que nem todos os parâmetros foram passados):
        //SELECT * FROM entregador WHERE idEntregador = ? AND nomeEntregador = ? AND telefone = ?
        
    const [rows] = await db.query(sql, values); //O vetor constante rows aguarda db.query
    //esta funação troca as interrogações do primeiro argumento (string de comando) pelos índices do segundo argumento (valores passados) e executa

    return rows; //Pegamos as chaves e fizemos uma consulta Mysql
    }
    
    
};

//Lembrando que usamos o export const para tornar a função pública, conhecida pelos outros arquivos e para entregadorController poder usá-la;
export const create = async (entregadorData)=>{
    //3 passos
    const newEntregador = {
        ...entregadorData
    };
    //Atribuimos à constante newEntregador os dados recebidos como parâmetro, que serão os dados de um novo entregador
    //Para transformar os dados em um objeto

    await db.query(' INSERT INTO entregador SET ? ', newEntregador);
    //Logo depois de definir a variável, já executamos pelo db.query - Ficará:
    //INSERT INTO entregador VALUES '01, Ricardo Machado, 99999-9999'

    return newEntregador; //Retorna-se os dados inseridos no formato objeto
};

export const update = async (idEntregador, entregadorData) =>{
    //2 passos
    const [result] = await db.query(' UPDATE entregador SET ? WHERE idEntregador = ?', [entregadorData, idEntregador]);
    //Só pegar os parâmetros, colocar na string do comando de atualização SQL e executar pelo db.query

    return result.affectedRows > 0; //A propriedade affectedRows pega o vetor result e retorna o número de linhas alteradas
};

export const remove = async (idEntregador) =>{
//Usamos reomve, pois delete não pode ser usado como variável
    //Fornecemos apenas o idEntregador para identificar qual entregador será removido; não há necessidade de informar dados, vamos deletar
    const [result] = await db.query(' DELETE entregador WHERE idEntregador = ? ', [idEntregador])

    return result.affectedRows > 0;
};

//Glória a Jesus! Aleluia! Meu Salvador é Ele, que alegria