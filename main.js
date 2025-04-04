console.log("Electron - Processo principal")


//importação dos recursos do framework - app se refere a aplicação e browserWindow e a criação da janela
//nativeTheme (definir tema claro ou escuro)
//Menu (definir menu personalizado)
//shell acessar links externos no navegador padrão (janela)
//ipcMain permite estabelecer uma comunicação entre processos (IPC) main.js <--> renderer.js (comunicação em duas vias)
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')


// Ativação do preload.js (importtação do path)
const path = require('node:path')

//importação dos metodos conectar e desconectar
const { conectar, desconectar } = require('./database.js')

// Importação do modelo de dados (Notes.js)
const noteModel = require('./src/models/Notes.js')

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

    //Ponte com o preload
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
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
  nativeTheme.themeSource = 'light'
  //obter a janela principal (tecnica da janela modal)
  const mainWindow = BrowserWindow.getFocusedWindow()
  //validação (se existe a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 320,
      height: 280,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      //estabelecer uma relação hierarquica entre janelas
      parent: mainWindow, //janela pai
      //criar uma janela modal (So retorna a janela pai quando a janela filho é encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }

  about.loadFile('./src/views/sobre.html')
  //recebimento da mensagem de renderização da tela sobre sobre para fechar a janela usando o botão 'OK'
  ipcMain.on('about-exit', () => {
    //validação (se existir a janela e ela não estiver destruida, fechada)
    if (about && !about.isDestroyed()) {
      about.close() //fechar a janela
    }


  })
}

//janela note
let note
function noteWindow() {
  nativeTheme.themeSource = 'light'
  // obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  // validação (se existir a janela principal)
  if (mainWindow) {
    note = new BrowserWindow({
      width: 320,
      height: 230,
      autoHideMenuBar: true,
      //resizable: false,
      //minimizable: false,
      //estabelecer uma relação hierarquica entre janelas
      parent: mainWindow,
      // criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }

  note.loadFile('./src/views/nota.html')
}

//inicialização da aplicação (usa .them, ou seja é um assincronismo)
//app está relacionado à app da linha 5
app.whenReady().then(() => {
  createWindow()

  //Melhor local para estabelecer a conexão com o banco de dados
  //primeiro cria a janela para depois abrir conexão com o banco de dados
  //no MongoDB é mais eficiente manter uma unica conexão aberta durante todo o tempo de vida do aplicativo e encerrar a conexão quando o aplicativo for finalizado
  //ipcMain.on (receber mensagem)
  //db-connect (rótulo da mensagem)
  ipcMain.on('db-connect', async (event) => {
    //a linha abaixo estabelece uma conexão com o banco de dados

    const conectado = await conectar()
    if (conectado) {
      // enviar ao renderizador uma mensagem para trocar a imagem do icone de status do banco de dados (criar um delay de 0.5 ou 1s para sincronização com a nuvem)
      setTimeout(() => {
        //enviar ao renderizador a mensagem "conectado"
        //db-status (IPC - comunicação entre processos - preload.js)
        //.replay encaminha mensagem 
        event.reply('db-status', "conectado")
      }, 500)
    }
  })

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

//IMPORTANTE: Desconectar do banco de dados quando a aplicação for finalizada
app.on('before-quit', async () => {
  await desconectar()
})

//Reduzir a verbosidade de logs não criticos (devtools)
app.commandLine.appendSwitch('log-level', '3')

//tempalte do menu
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar Nota',
        accelerator: 'Ctrl+N',
        click: () => noteWindow()
      },
      {
        type: 'separator'
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
        label: 'DevTools',
        role: 'toggleDevTools'
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
        click: () => aboutWindow()
      }
    ]

  }
]

// =================================================================
// == CRUD Create ==================================================


// Recebimento do objeto que contem os dados da nota
//sempre que trabalhar com banco de dados usar o trycatch para tratamento de excessão
ipcMain.on('create-note', async(event, stickNote) => {
  //IMPORTANTE! Teste de recebimento do objeto - Passo 2
  console.log(stickNote)
  //uso do trycathc para tratamento de excessões
  try {
    //Criar uma nova estrutura de dados para salvar no banco
  //ATENÇÃO!!! Os atributos da estrutura precisam ser identicos ao modelo e os valores são obtidos através do objeto StickNotes
  const newNote = noteModel({
    texto: stickNote.textNote,
    cor: stickNote.colorNote
  })
  // Salvar a nota no bancod e dados (Passo 3 - fluxo)
  newNote.save()
  //enviar ao renderizador um pedido para limpar os campos e setar o formulario com os padrões originais (foco no texto usando o preload js[event relaciona ao event la de cima do ipcMain]
  event.reply('reset-form')
  } catch (error) {
    console.log(error)
  }
  
 })


// == Fim - CRUD Create ============================================
// =================================================================