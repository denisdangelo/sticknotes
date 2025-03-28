/**
 * Modelo de dados das notas
 * Criação da coleção
 */

// importação dos recursos do moongose
const {model, Schema} = require('mongoose')

//criação da estrutura da criação
const noteSchema = new Schema({
    texto: {
        type: String
    },
    cor:{
        type: String
    }

}, {versionKey: false})

//exportar o modelo de dados para o main
module.exports = model('Notas', noteSchema)