import jwt from 'jsonwebtoken';
//importando as funções de web token da biblioteca jsonwebtoken

const authMiddleware = async (req, res, next) =>{
    //1. Buscar o token no cabeçalho da requisição
    const authHeader = req.headers.authorization;
    //A partir da requisição passada como parâmetro, definimos a constante authHeader

    if (!authHeader) {
        return res.status(401).json({message: 'Token de autorização não fornecido.'});
    }

    //O formato do token é "Bearer TOKEN". Precisamos separar as duas partes.

    const parts = authHeader.split(' '); //split é uma função que recebe como parâmetro, neste caso, o espaço; ela separará a variável em partes onde houver este parâmetro.
    //Assim, parts será um vetor em que cada índice é uma parte de authHeader
    if (parts.lenght !== 2) {
        //O tamanho do vetor ser diferente de dois, significa que algo deu errado, pois era para ter o bearer e o TOKEN, exatamente duas partes
        return res.status(401).json({message: 'Token em formato inválido.'})
    }

    const [scheme, token] = parts;
    //Dessa forma scheme = primeira parte e token = segunda parte
    //Vamos verificar se a primeira parte é realmente 'Bearer'
    if (!/^Bearer$/.test(scheme)) {
        return req.status(401).json({message: 'Token mal formatado.'});
    }
    //Se não for 'Bearer' está no formato errado de token

    //2. Validar o token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        //Verificando através da função jwt verify que recebe como parâmetros token e a frase secreta do JWT
        //Essa função retornará erro ou decoded que já passamos como argumentos de uma função anônima
        if(err) {
            return res.status(401).json({message: 'Token inválido ou expirado.'});
            //Se vier erro, ou seja, a verificação entregar false sobre o token, retornamos a mensagem de erro
        }

        //3. Se o token for válido, adicionamos os dados do usuário na requisição

        req.userCpf = decoded.cpf;
        req.userEmail = decoded.email;

        //4. Chama o próximo middleware ou o controlador final, pois o usuário está permitido para prosseguir se chegou até aqui
        return next();
    });
}
export default authMiddleware;