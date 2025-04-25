/**
 * Preload.js - Usado no framework electron para aumentar a segurança e o desempenho
 */

//importação dos recursis di framework electron
//ipcRenderer permite estabelecer uma comunicação entre processos (IPC) main.js <--> renderer.js (comunicação em duas vias)
//contextBridge: permisões de comunicação entre processos usando a API do electron
const {ipcRenderer, contextBridge} = require('electron')



//Enviar uma mensagem para o main.js estabelecer uma conexão com o banco de dados quando iniciar a aplicação
//send (enviar)
//db-connect é um rotulo para identificar a mensagem 
//geralmente a conexão com o main que nãop vem do renderer é feito fora do contextBriddge, mas nesse caso ele serpa usadno por fora
//ipcRenderer.send('db-connect')


//permissões para estabelecer a comunicação entre processos

contextBridge.exposeInMainWorld('api', {
    dbConnect: () => ipcRenderer.send('db-connect'),
    dbStatus: (message) => ipcRenderer.on('db-status', message), // .on recebe db-status sintoniza ipc Renderer é o arquivo renderer do JS
    aboutExit: () => ipcRenderer.send('about-exit'), //.send está enviando
    createNote: (stickNote) => ipcRenderer.send('create-note', stickNote),
    //mandar um argumento vazio
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    listNotes: () => ipcRenderer.send('list-notes'),
    renderNotes: (notes) => ipcRenderer.on('render-notes', notes),
    updateList: () => ipcRenderer.send('update-list'),
    mainReload: (args) => ipcRenderer.on ('main-reload', args)
})