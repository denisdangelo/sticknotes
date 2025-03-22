/**
 * Processo de renderização do documento sobre.html
 */

//enviar uma mensagem para o processo principal fechar a janela sobre
function fechar() {
    // executar a função aboutExit() vinculada ao preload.js atraves da api do electron (ipcRenderer)
    api.aboutExit()
}