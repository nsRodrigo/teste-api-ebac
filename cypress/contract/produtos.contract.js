const joi = require('joi');
const produtoSchema = joi.object({
    quantidade: joi.number(),
    produtos: joi.array().items({
        nome: joi.string(),
        preco: joi.number(),
        descricao: joi.number(),
        quantidade: joi.number(),
        _id: joi.string()
    })
});

export default produtoSchema;