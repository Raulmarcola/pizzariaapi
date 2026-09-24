import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as clienteService from '../services/clienteService.js';

export const login = async (req, res) =>{
    const {cpf, senha} = req.body
    try{
        //1. Verificar se o usuário existe no banco de dados
        const clientes = await clienteService.findAll(cpf);
        // Usa a função findAll que definimos em clienteService passando a variável cpf (que pegamos da requisição) como parâmetro. 
        // Assim, fará a busca no mysql.
        const cliente = clientes[0]
        //Fazendo isso para pegar apenas a primeira posição de clientes, ou seja, só o atributo cpf e não todos os campos
        if (!cliente) {
            return res.status(401).json({message: 'Credenciais Inválidas.'})
        }
        //Se chegou até aqui, o cpf existe, é um usuário cadastrado.

        // 2. Comparar a senha enviada com a senha guardada no hash
        const senhaValida = await bcrypt.compare(senha, cliente.senha)
        // Usaremos a função compare da biblioteca bcrypt em função da senha informada e da senha cadastrada no usuário que encontramos através do findAll
        if(!senhaValida){
            return res.status(401).json({message: 'Credenciais Inválidas.'})
        }
        //3. Gerar o token JWT
        //Uma chave digital, um crachá que te permite transitar pela web
        //O 'payload' são as informações que queremos guardar no token
        const payload = {cpf: cliente.cpf, email: cliente.email}
        //Cliente é um objeto. Após o ponto, colocamos o atributo de cliente como cpf ou email
        //O token é assinado com a nossa chave secreta do .env
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h' //Token expira em uma hora
        });

        //4. Enviar o token para o cliente
        res.json({message: 'Login bem-sucedido!', token: token});

    }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro interno do servidor.'});
    }
}