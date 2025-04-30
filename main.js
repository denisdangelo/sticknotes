const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')

const path = require('node:path')

const { connectDB, disconnectDB } = require('./database.js')

const noteModel = require('./src/models/Notes.js')

let win
const createWindow = () => {
  nativeTheme.themeSource = 'dark'
  win = new BrowserWindow({ 
    width: 1010,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html') 
}

let about
function aboutWindow() {
  nativeTheme.themeSource = 'light'
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    about = new BrowserWindow({
      width: 320,
      height: 280,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }

  about.loadFile('./src/views/sobre.html')
  ipcMain.on('about-exit', () => {
    if (about && !about.isDestroyed()) {
      about.close() 
    }


  })
}

let note
function noteWindow() {
  nativeTheme.themeSource = 'light'
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    note = new BrowserWindow({
      width: 420,
      height: 270,
      autoHideMenuBar: true,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  note.loadFile('./src/views/nota.html')
}

app.whenReady().then(() => {
  createWindow()
  ipcMain.on('db-connect', async (event) => {
    const connected = await connectDB()
    if (connected) {
      setTimeout(() => {
        event.reply('db-status', "conectado")
      }, 500)
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  await disconnectDB()
})

app.commandLine.appendSwitch('log-level', '3')

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
        click: () => updateList()
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

ipcMain.on('create-note', async(event, stickNote) => {
  try {
  const newNote = noteModel({
    texto: stickNote.textNote,
    cor: stickNote.colorNote
  })
  newNote.save()
  event.reply('reset-form')
  } catch (error) {
    console.log(error)
  }
  
 })

ipcMain.on('list-notes', async (event) => {
  try {
    const notes = await noteModel.find()    
    event.reply ('render-notes', JSON.stringify(notes))
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('update-list' , () => {
  updateList()
})

function updateList(){
if (win && !win.isDestroyed()) 
win.webContents.send('main-reload')
setTimeout(() => {
  win.webContents.send('db-status', "conectado")
}, 200)
}

ipcMain.on('delete-note', async (event, id) => {
  const  response  = await dialog.showMessageBox(win, { 
    type: 'warning',
    title: 'Atenção!',
    message: 'Tem certeza que deseja excluir esta nota?\n Esta ação não podera ser desfeita',
    buttons: ['Cancelar' , 'Excluir']
  })
  if (response.response === 1) {
  try {
      const deleteNote = await noteModel.findByIdAndDelete(id)
      updateList()
    } catch (error) {
    console.log(error)
  }
}
})