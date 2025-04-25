/**
 * Renderer JS. Arquivo de reinderização do padrão do electron
 * Serve para comunicação com o processo principal
 * Processo de reinderização do documento index.html
 */

console.log("Processo de reinderização")

//Estrategia para renderizar (desenhar) as notas adesivas
//usar uma lista para preencher de forma dinamica os itens (notas)
//vetor global para manipular os dados do banco
let arrayNotes = []

//captura do id da lista <ul> do documento index.html
const list = document.getElementById('listNotes')

// inserção da data no rodapé
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

document.getElementById('dataAtual').innerHTML = obterData()

// Troca do icone do banco de dados (status da conexão)
//uso da api definida no arquivo preload.js
//event no arquivo main e message no preload.js
api.dbStatus((event, message)=>{
    //teste de recebimento da mensagem
    console.log(message)
    if (message === "conectado") {
        document.getElementById('iconeDB').src = "../public/img/dbon.png"
    } else {
        document.getElementById('iconeDB').src = "../public/img/dboff.png"
    }
})


//enviar ao main um pedido ara conectar com o banco de daods quando a janela principal for inicializado 
api.dbConnect()
// =================================================================
// == CRUD READ ====================================================
    //passo 1: Emviar ao Main um edido para listar as notas
    api.listNotes()

    //passo 5: Recebimento da notas via IPC e rederização (desenho) das notas no documento index.html
    api.renderNotes((event, notes) => {
        const renderNotes = JSON.parse(notes) // json.parse converte de string para JSON
        console.log(renderNotes) //TESTE de Recebimento (passo5)
        //rederizar no index.html o conteudo da array (vetor)
        arrayNotes = renderNotes //atribuir ao vetor o JSON recebido
        //uso do laço forEach para percorrer o vetor e extrair os dados
        arrayNotes.forEach((n) => {
            //adição de tags <li> no documento index.html
            list.innerHTML += `
            <br>
            <li>
                <p>${n._id}</p>
                <p>${n.texto}</p>
                <p>${n.cor}</p>
            </li>
            `
        })
    })


// =================================================================
// == FIM CRUD READ ================================================

// =================================================================
// == Atualização das notas ========================================

api.mainReload((args) => {
    location.reload() //reinicia a pagina
})

// =================================================================
// == Atualização das notas - FIM ========================================