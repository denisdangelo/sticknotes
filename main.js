console.log("Electron - Processo principal")


//importação dos recursos do framework - app se refere a aplicação e browserWindow e a criação da janela
const { app, BrowserWindow } = require('electron/main')

//janela principal
let win
const createWindow = () => {
    win = new BrowserWindow({ //BrowserWindow é uma classe modelo do Electron
    width: 1010,
    height: 720,
    //frame: false, - tira todas as informações da janela 
    //resizable: false, - retira a opção de alterar o tamanho da janela
    //minimizable: false, - retira a opção de minimizar a janela
    //closable: false, - impede o fechamento da janela
    //autoHideMenuBar: true - retira o menu de opções abaixo do nome da aplicação

  })

  win.loadFile('./src/views/index.html') //aqui deve ir o caminho para o index.html - win.loadFile - carrega o doc html na janela
}

//inicialização da aplicação (usa .them, ou seja é um assincronismo)
//app está relacionado à app da linha 5
app.whenReady().then(() => {
  createWindow()

  // só ativa a janela se nenhuma outra estiver ativa
  //compatibilização com as diversas plataformas 
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

//se o sistema não for MAC fechar encerrar a aplicação quando a janela for fechada
//compatibilização com as diversas plataformas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})