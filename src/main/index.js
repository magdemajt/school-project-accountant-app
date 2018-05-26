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
    height: 600,
    useContentSize: true,
    width: 800
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

function getFilesData (path, callback) {
  fs.readdir(path, (err, files) => {
    if (err) {
      throw err
    }
    var index = 0
    files.forEach((f) => {
      var file = fs.readFileSync(path + '/' + f, {encoding: 'utf-8'}) // Tu jest problem
      index = index > Number(file.substr(0, 1)) ? index : Number(file.substr(0, 1))
      var assetsIndex = file.indexOf('Assets') + 'Assets\n'.length
      var liabIndex = file.indexOf('Liabilities')
      var assets = file.substr(assetsIndex, liabIndex - assetsIndex)
      var assetLines = assets.split('\n')
      assetLines.pop()
      assets = []
      assetLines.forEach((line) => {
        var data = line.split(';')
        var desc = data[4].replace('(new_line_@#@#)', '\n').replace('#(semi)', ';')
        assets.push({name: data[0], money: Number(data[1]), category: {indexInGroup: Number(data[2]), indexInSub: Number(data[3])}, desc})
      })
      var liabs = file.substr(liabIndex + 'Liabilities\n'.length)
      var liabLines = liabs.split('\n')
      liabLines.pop()
      liabs = []
      liabLines.forEach((line) => {
        var data = line.split(';')
        var desc = data[4].replace('(new_line_@#@#)', '\n').replace('#(semi)', ';')
        liabs.push({name: data[0], money: Number(data[1]), category: {indexInGroup: Number(data[2]), indexInSub: Number(data[3])}, desc})
      })
      // eslint-disable-next-line
      callback({assets, liabs, index})
    })
  })
}

ipcMain.on('getData', (event) => {
  if (!fs.existsSync('./records')) {
    try {
      fs.mkdirSync('./records')
    } catch (e) {
      throw e
    }
  }
  getFilesData('./records', (args) => {
    event.sender.send('sendingData', args)
  })
})

ipcMain.on('getUnfinished', (event) => {
  if (!fs.existsSync('./unfinished')) {
    try {
      fs.mkdirSync('./unfinished')
    } catch (e) {
      throw e
    }
  }
  getFilesData('./unfinished', (args) => {
    event.sender.send('sendingUnfinished', args)
  })
})

ipcMain.on('add', (event, args) => {
  console.log('')
  var assets = args.assets
  var liabs = args.liabs
  var index = args.index
  var toSave = index + '\n' // Spisywanie danych z otrzymanego rekordu do pliku z rozszerzeniem .csv
  toSave += 'Assets\n'
  assets.forEach((asset) => {
    var sanitizedDesc = asset.desc.replace('\n', '(new_line_@#@#)').replace(';', '#(semi)')
    toSave += asset.name + ';' + asset.money + ';' + asset.category.indexInGroup + ';' + asset.category.indexInSub + ';' + sanitizedDesc + '\n'
  })
  toSave += 'Liabilities\n'
  liabs.forEach((liab) => {
    var sanitizedDesc = liab.desc.replace('\n', '(new_line_@#@#)').replace(';', '#(semi)')
    toSave += liab.name + ';' + liab.money + ';' + liab.category.indexInGroup + ';' + liab.category.indexInSub + ';' + sanitizedDesc + '\n'
  })
  var path = ''
  if (!args.unfinished) {
    path = './records/' + index + '.csv'
  } else {
    path = './unfinished/' + index + '.csv'
  }
  // event.sender.send('reply')
  var file = fs.openSync(path, 'w+')
  console.log(toSave)
  fs.write(file, toSave, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('success in writing file' + index)
    }
    event.sender.send('saved')
    fs.close(file)
  })
})

ipcMain.on('remove', (event, args) => {
  fs.unlinkSync('./unfinished/' + args + '.csv')
})

// ipcMain.on('editOne', (event, args) => {
//   var path = './records/' + args.old.file + '.csv'
//   fs.readFile(path, 'utf8', function (err, data) {
//     if (err) {
//       console.log(err)
//     }
//     var sanitizedDesc = args.old.desc.replace('\n', '(new_line_@#@#)').replace(';', '#(semi)')
//     var toReplace = args.old.name + ';' + args.old.money + ';' + args.old.category.indexInGroup + ';' + args.old.category.indexInSub + ';' + sanitizedDesc + '\n'
//     var newSanitizedDesc = args.newInp.desc.replace('\n', '(new_line_@#@#)').replace(';', '#(semi)')
//     var replacement = args.newInp.name + ';' + args.newInp.money + ';' + args.newInp.category.indexInGroup + ';' + args.newInp.category.indexInSub + ';' + newSanitizedDesc + '\n'
//     var result = data.replace(toReplace, replacement)

//     fs.writeFile(path, result, 'utf8', function (err) {
//       if (err) {
//         console.log(err)
//       }
//     })
//   })
// })
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
