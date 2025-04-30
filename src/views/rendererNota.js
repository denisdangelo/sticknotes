const foco = document.getElementById('inputNote')

document.addEventListener('DOMContentLoaded', () => {
    foco.focus()
})

let frmNote = document.getElementById('frmNote')
let note = document.getElementById('inputNote')
let color = document.getElementById('selectColor')

frmNote.addEventListener('submit', async (event) => {
    event.preventDefault()
    const stickNote = {
        textNote: note.value,
        colorNote: color.value
    }
    api.createNote(stickNote)
})

api.resetForm((args) => {
    location.reload()
    api.updateList()
})