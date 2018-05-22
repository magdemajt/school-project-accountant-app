'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

const fs = require('fs')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  if (process.env.NODE_ENV !== 'production') {
    require('vue-devtools').install()
  }
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on('readData', () => {})
ipcMain.on('addRecord', (event, args) => {
  var assets = args[0]
  var liabs = args[1]
  var index = args[2]
  event.sender.send('reply')
  var path = './records/' + index + '.csv'
  var file = fs.openSync(path, 'w+')
  var toSave = index + '\n' //Spisywanie danych z otrzymanego rekordu do pliku z rozszerzeniem .csv 
  toSave += assets.reduce((value, asset) => {
    return value + asset.name + ';' + asset.money + ';' + asset.category + ';'
  })
  toSave += '\n'
  toSave += liabs.reduce((value, liab) => {
    return value + liab.name + ';' + liab.money + ';' + liab.category + ';'
  })
  fs.write(file, toSave, (err) => {
    if (err) console.log(err)
    else 
      console.log('success in writing file' + index)
    fs.close(file)
  })
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
