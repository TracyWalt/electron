let { ipcRenderer } = require('electron')
let time = require('../time/time')

module.exports = {
    D: {
        'cntWin': document.querySelectorAll('.main-cnt'),
        'dev': document.querySelector('.main-cnt-dev'),
        'time': document.querySelector('.main-cnt-time'),
        'setting': document.querySelector('.main-cnt-setting'),
    },
    init() {
        const S = this
        // 切换到cmd界面
        ipcRenderer.on('clickDev', (event, data) => {
            S.D.cntWin.forEach((item) => {
                item.style.display = 'none'
            })
            S.D.dev.style.display = 'block'
        })

        // 切换到工时界面
        ipcRenderer.on('clickTime', (event, data) => {
            S.D.cntWin.forEach((item) => {
                item.style.display = 'none'
            })
            S.D.time.style.display = 'block'

            // 每次切换到工时界面，重新刷新数据
            time.init()
        })

        // 切换到设置界面
        ipcRenderer.on('clickSetting', (event, data) => {
            S.D.cntWin.forEach((item) => {
                item.style.display = 'none'
            })
            S.D.setting.style.display = 'block'
        })
    },
}