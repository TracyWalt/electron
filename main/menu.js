let { Menu } = require('electron')

let template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Settings'
            },
            {
                label: 'Exit',
                role: 'quit'
            }
        ]
    }
]

let m = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(m)