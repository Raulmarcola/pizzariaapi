const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }
    next();
    // você passa a ele, como parâmetro o next, uma função que será a próxima execução do programa para ele já executar

    // O Middleware vem entre o recebimento de dados se a execução por isso é o local onde os dados inseridos são validados e tem um próximo passo a ser seguido como parâmetro, sempre haverá algo após a validação
};
//usando 'export default' para exportar a função principal do módulo

export default validate;

