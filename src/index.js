import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
// path e fileURL servem paran ignorar e se adaptar ao caminho anterior a pasta raulNode, pois este caminho muda de máquina para máquina.
import path from 'path';
import { fileURLToPath } from 'url';

//Importando Rotas
//Rotas de identiificação
// import authRoutes from './routes/authRoutes.js';

import clienteRoutes from './routes/clienteRoutes.js';

import produtoRoutes from './routes/produtoRoutes.js';

import pedidoRoutes from './routes/pedidoRoutes.js';

// --- CONFIGURAÇÕES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: ['http://localhost:3333', 'https://meudominio.com'],
    methods: 'GET, POST, PUT, PATCH, DELETE',
    credentials: true,
};

// corsOptions é um objeto que será interpretado pela instalação cors como configurações

// --- INICIALIZAÇÃO DO APP ---

// .use define como ele usará cada biblioteca

const app = express();
//express é uma biblioteca que controla métodos http dentro do node

// --- MIDDLEWARES ---
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
//mapea o status code a partir do watch colocado no package.json (200, 404) por exemplo
app.use(express.json());

//Servindo pasta 'public' para arquivos (CSS, JS, imagens).
app.use(express.static(path.join(__dirname, '..', 'public')));

// .. serve para voltar para o diretório anterior, assim o index terá acesso a public

// --- ROTAS ---
// rota principal que serve a página HTML
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'pages', 'home.html'))
})
// join é junção. Ele juntará todo o conteúdo anterior de forma adaptada (__dirname), diretório anterior (..), pasta pages (pages) e o arquivo home.html na URL

//Rotas da API prefixadas, isso evita conflitos e evidencia quais rotas pertencem a API.

const apiPrefix = '/api';
// //Rotas gerais da API (ex: /api/sandro)
// // Atrelando rota URL ao arquivo, à funcionalidade
app.use(`${apiPrefix}/clientes`, clienteRoutes);
// // /api/clientes/
// app.use(`${apiPrefix}/login`, authRoutes);
// /api/login/
app.use(`${apiPrefix}/produtos`, produtoRoutes);
// /api/produtos/
app.use(`${apiPrefix}/pedidos`, pedidoRoutes);
// /api/pedidos/ (exige token)

// --- TRATAMENTO DE ERROS ---
//um middleware de erro centralizado.
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORTA = process.env.PORT;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`)
});