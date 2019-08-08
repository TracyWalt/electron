let path = require('path')
let cfg = require('./config')

let FileList = {
    readFileList(path, foldername, filesList) {
        let files = fs.readdirSync(path+foldername)
        files.forEach((itm) => {
            if (itm.indexOf('.js') != -1 && itm.indexOf('common.js') == -1) {
                filesList.push({
                    path: path+foldername,
                    filename: itm,
                    foldername,
                })
            }
        })
    },
    //获取文件夹下的所有文件
    getFileList(path) {
        const S = this
        let filesList = []
        try {
            let files = fs.readdirSync(path)
            // 过滤掉不是文件夹的目录
            files.forEach((itm) => {
                if (itm.indexOf('.js') == -1) {
                    S.readFileList(path, itm, filesList)
                }
            })
        } catch (error) {
            
        }
        return filesList
    },
    // 创建配置文件
    createConfig() {
        try {
            // 文件是否存在
            fs.statSync(path.join(cfg.config.cfgPath))
        } catch (error) {
            // 不存在，则自动创建目录和文件
            fs.mkdirSync(cfg.config.cfgRootPath)
            let __cfg = {
                'rootDir': cfg.config.rootDir,
                'folder': ''
            }
            fs.writeFileSync(path.join(cfg.config.cfgPath), JSON.stringify(__cfg), {'flag': 'w'}, (err) => {
                if (err) {
                    console.log('config.json 文件写入失败')
                }
            })
        }
    },
    // 获取配置文件
    getConfig() {
        return fs.readFileSync(path.join(cfg.config.cfgPath)) ? JSON.parse(fs.readFileSync(path.join(cfg.config.cfgPath))) : {}
    },
    // 获取配置文件路径
    getConfigPath() {
        return cfg.config.cfgPath
    },
}

FileList.createConfig()

module.exports = FileList