import mysql from 'mysql2/promise';
// promise é uma funcionalidade da biblioteca mysql2 que conecta o banco de dados ao servidor
// criação do pool de conexões

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
})

// Assim como atribuímos todos os poderes de express para app no index, estamos atribuindo a funcionalidade pool a db

//Função de teste de conexão auto-executável
(async () => {
    try{
        const connection = await db.getConnection();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        connection.realese();
    } catch (err) {
        console.error('Erro ao tentar conectar ao banco de dados:', err);
    }
})();