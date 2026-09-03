import 'dotenv/config';
import express from 'express';
import { pizzas } from './cardapio.js';
 
const app = express()
// Todos os poderes do express foram passados para a variável app

app.use(express.json())


app.get('/', (req,res) => {
 
    res.json({ message: "Bem Vindo á API da Pizzaria Senac"});
});
// get é um pegar/obter através do caminho que você informar
 
const PORTA = process.env.PORT
 
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta  ${PORTA}`)
});

app.get('/pizzas', (req, res) => {
    res.json(pizzas);
})
// Ele importa o vetor pizzas do arquivo cardápio e manda como um arquivo json que é a resposta
// req = requisição, no caso não foi feita uma requisição é só uma rota comum; não tem parâmetro
// res = resposta

app.get('/pizzas/:id', (req,res) =>{
    const id = parseInt(req.params.id);
    //Convertendo a requisição parâmetro id para uma variável
    const pizza = pizzas.find(p => p.id === id);
    // Como o for of; Pega o atributo id do objeto pizza e compara com o id que veio como parâmetro e convertemos para variável

    if(!pizza) {
        return res.status(404).json({error: 'Pizza não encontrada'});
    }

    res.status(200).json(pizza);
});