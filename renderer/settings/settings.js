let { ipcRenderer } = require('electron')

module.exports = {
    configPath: filelist.getConfigPath(),
    config: filelist.getConfig(),
    rootDir: filelist.getConfig().rootDir,
    folder: filelist.getConfig().folder,
    D: {
        'settingInput': document.querySelector('.setting-value'),
        'settingFolder': document.querySelector('.setting-folder'),
        'settingBtn': document.querySelector('.setting-btn')
    },
    init() {
        // 初始化根目录
        this.D.settingInput.value = this.rootDir
        this.D.settingFolder.value = this.folder || ''
        this.bindEvent()
    },
    bindEvent() {
        const S = this
        // setting save
        S.D.settingBtn.onclick = () => {
            let curDir = S.D.settingInput.value
            let floder = S.D.settingFolder.value
            if (!curDir) return
            S.config.rootDir = curDir
            S.config.folder = floder
            fs.writeFile(S.configPath, JSON.stringify(S.config), {'flag': 'w'}, (err) => {
                if (err) {
                    console.log('config.json 文件写入失败')
                }
                // 文件更新成功，刷新窗口
                ipcRenderer.send('reload')
            })
        }
    },
}
