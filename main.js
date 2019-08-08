// 主进程
let {app, BrowserWindow, ipcMain} = require('electron')

let win = null

// 模块加载完成
app.on('ready', () => {

    // 创建新窗口
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
        // webContents: true,
    })

    //开启渲染进程中的调试模式
    if (process.env.NODE_ENV == 'dev'){
        win.webContents.openDevTools()
    }

    // 引入主页面
    win.loadFile('index.html')

    win.on('closed', () => {
        win = null
    })

    // 自定义系统菜单
    win.webContents.on('did-finish-load', () => {
        require('./main/menu')

        ipcMain.on('reload', (ev, data) => {
            win.reload()
        })
    })
})