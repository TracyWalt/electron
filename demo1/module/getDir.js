// 获取目录
function readFileList(path, foldername, filesList) {
    let obj = {}
    let files = fs.readdirSync(path+foldername);
    obj.foldername = foldername;
    files.forEach(function (itm, index) {
        if (itm.indexOf('.js') != -1){
            obj.path = path+foldername;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }
    })
}

let getFiles = {
    //获取文件夹下的所有文件
    getFileList: function (path) {
        let files = fs.readdirSync(path);

        // 过滤掉不是文件夹的目录
        let filesList = []
        files.forEach(function(itm,index){
            if (itm.indexOf('.js') == -1){
                readFileList(path, itm, filesList);
            }
        })

        return filesList;
    }
};

module.exports = getFiles