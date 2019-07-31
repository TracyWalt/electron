// 主进程
let {app, BrowserWindow} = require('electron')

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
    win.webContents.openDevTools()

    // 引入主页面
    win.loadFile('index.html')

    win.on('closed', () => {
        win = null
    })
})