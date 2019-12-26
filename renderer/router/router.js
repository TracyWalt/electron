let { ipcRenderer } = require('electron')
let time = require('../time/time')
let task = require('../task/task')

module.exports = {
    D: {
        'cntWin': document.querySelectorAll('.main-cnt'),
        'dev': document.querySelector('.main-cnt-dev'),
        'time': document.querySelector('.main-cnt-time'),
        'task': document.querySelector('.main-cnt-task'),
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
        let isLoad = false
        ipcRenderer.on('clickTime', (event, data) => {
            S.D.cntWin.forEach((item) => {
                item.style.display = 'none'
            })
            S.D.time.style.display = 'block'

            // 每次切换到工时界面，重新刷新数据
            if(!isLoad){
                time.init()
                isLoad = true
            }
        })

        // 切换到任务界面
        let isTaskLoad = false
        ipcRenderer.on('clickTask', (event, data) => {
            S.D.cntWin.forEach((item) => {
                item.style.display = 'none'
            })
            S.D.task.style.display = 'block'

            // 每次切换到工时界面，重新刷新数据
            if(!isTaskLoad){
                task.init()
                isTaskLoad = true
            }
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