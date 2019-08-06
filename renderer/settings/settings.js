let { ipcRenderer } = require('electron')

let settings =  {
    config: filelist.getConfig(),
    rootDir: filelist.getConfig().rootDir,
    D: {
        'settingInput': document.querySelector('.setting-value'),
        'settingBtn': document.querySelector('.setting-btn')
    },
    init() {
        // 初始化根目录
        this.D.settingInput.value = this.rootDir
        this.bindEvent()
    },
    bindEvent() {
        const S = this
        // setting save
        S.D.settingBtn.onclick = () => {
            let curDir = S.D.settingInput.value
            if (!curDir) return
            S.D.config.rootDir = curDir
            fs.writeFile(cfgPath, JSON.stringify(S.D.config), {'flag': 'w'}, (err) => {
                if (err) {
                    console.log('config.json 文件写入失败')
                }
                // 文件更新成功，刷新窗口
                ipcRenderer.send('reload')
            })
        }
    },
}

settings.init()

