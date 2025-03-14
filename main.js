console.log("Electron - Processo principal")


//importação dos recursos do framework - app se refere a aplicação e browserWindow e a criação da janela
//nativeTheme (definir tema claro ou escuro)
//Menu (definir menu personalizado)
//shell acessar links externos no navegador padrão (janela)
const { app, BrowserWindow, nativeTheme, Menu, shell} = require('electron/main')

//janela principal
let win
const createWindow = () => {
  //definindo o tema claro ou escuro para a janela
  nativeTheme.themeSource = 'dark'

  //
  win = new BrowserWindow({ //BrowserWindow é uma classe modelo do Electron
    width: 1010,
    height: 720,
    //frame: false, - tira todas as informações da janela 
    //resizable: false, - retira a opção de alterar o tamanho da janela
    //minimizable: false, - retira a opção de minimizar a janela
    //closable: false, - impede o fechamento da janela
    //autoHideMenuBar: true - retira o menu de opções abaixo do nome da aplicação

  })

  //carregar o menu personalizado
  //Atenção! ANtes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html') //aqui deve ir o caminho para o index.html - win.loadFile - carrega o doc html na janela
}
//para criar uma nova janela, sempre carregar BrowserWindow
//Janela Sobre
let about
function aboutWindow() {
  nativeTheme.themeSource= 'light'
  //obter a janela principal (tecnica da janela modal)
  const mainWindow = BrowserWindow.getFocusedWindow()
  //validação (se existe a janela principal)
  if(mainWindow){
    about = new BrowserWindow({
      width: 320,
      height: 280,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      //estabelecer uma relação hierarquica entre janelas
      parent: mainWindow, //janela pai
      //criar uma janela modal (So retorna a janela pai quando a janela filho é encerrada)
      modal: true
    })
  }
  
  about.loadFile('./src/views/sobre.html')
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

//Reduzir a verbosidade de logs não criticos (devtools)
app.commandLine.appendSwitch('log-level','3')

//tempalte do menu
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar Nota',
        accelerator:'Ctrl+N'
      },
      {
        type:'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      },
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar Zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom Padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label:'DevTools',
        role:'toggleDevTools'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExternal('https://github.com/denisdangelo/sticknotes')
    },
    {
      label: 'Sobre',
      click:() => aboutWindow()
    }
    ]
  
  }
]