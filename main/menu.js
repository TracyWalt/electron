let { Menu, BrowserWindow } = require('electron')

// 获取到当前活动窗口
let win = BrowserWindow.getFocusedWindow()

let template = [
    {
        label: '文件',
        submenu: [
            {
                label: '刷新',
                role: 'reload',
            },
            {
                label: '退出',
                role: 'quit',
            },
        ]
    },
    {
        label: '命令',
        click: function(){
            win.webContents.send('clickDev')
        },
    },
    {
        label: '设置',
        click: function(){
            win.webContents.send('clickSetting')
        },
    },
    {
        label: '工时',
        click: function(){
            win.webContents.send('clickTime')
        },
    },
]

let m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)