import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Passando os poderes de mysql.createPool foram passados para db

(async () =>{
    try{
        const connection = await db.getConnection();
        console.log("Conexão feita com sucesso!");
        connection.release();
    } catch(err){
        console.error('Erro ao conectar com o banco')
    }
})();

export default db;