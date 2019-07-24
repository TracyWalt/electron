// 主进程

let {app, BrowserWindow} = require('electron')

let win = null

// 模块加载完成
app.on('ready', () => {

    // 创建新窗口
    win = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    // 引入主页面
    win.loadFile('index.html')

    win.on('closed', () => {
        win = null
    })
})