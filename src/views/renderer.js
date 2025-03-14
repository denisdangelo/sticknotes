/**
 * Renderer JS. Arquivo de reinderização do padrão do electron
 * Serve para comunicação com o processo principal
 * Processo de reinderização do documento index.html
 */

console.log("Processo de reinderização")

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