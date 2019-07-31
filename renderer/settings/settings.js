let { ipcRenderer } = require('electron')

let settingInput = document.querySelector('.setting-value')
let settingBtn = document.querySelector('.setting-btn')

// 初始化根目录
settingInput.value = __config.rootDir

// setting save
settingBtn.onclick = () => {
    let curDir = settingInput.value
    if (!curDir) return
    __config.rootDir = curDir
    fs.writeFile(path.join(__dirname,'/data/config.json'), JSON.stringify(__config), {'flag': 'w'}, (err) => {
        if (err) {
            console.log('config.json 文件写入失败')
        }
        // 文件更新成功，刷新窗口
        ipcRenderer.send('reload')
    })
}