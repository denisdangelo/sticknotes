/**
 * Processo de Renderização do documento html
 */
 
// Para debugar  e testar a aplicação
//console.log("teste")

//capturar o foco da caixa de texto
const foco = document.getElementById('inputNote')

//alterar as propriedades do documento html ao iniciar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    foco.focus() //iniciar o documento com foco na caixa de texto
})

//Capturar os dados do formulário (Passo1: - fluxo)
let frmNote = document.getElementById('frmNote')
let note = document.getElementById('inputNote')
let color = document.getElementById('selectColor')

// =================================================================
// == CRUD Create ==================================================



// tecle ENTER PRA SALVAR
// Evento relacionado ao botão submit
frmNote.addEventListener('submit', async (event) => {
    // evitar o comportamento padrão (recarregar a página)
    event.preventDefault()
    // IMPORTANTE! (teste de recebimento dos dados do form - Passo 1)
    console.log(note.value, color.value)
    //criar um objeto para enviar ao main os dados da nota
    const stickyNote = {
        textNote: note.value,
        colorNote: color.value
    }
    // Enviar o objeto para o main (Passo 2: fluxo)
    api.createNote(stickyNote)
})

// == Fim - CRUD Create ============================================
// =================================================================

// == reset form (resetar o formulário) ============================
// =================================================================
api.resetForm((args) => {
    //recarregar a página
    location.reload()
})

// == FIMreset form (resetar o formulário ==============================
// =================================================================