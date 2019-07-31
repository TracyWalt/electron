module.exports = {
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
    }
}