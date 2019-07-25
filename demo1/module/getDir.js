const join = require('path').join;

// 获取目录
let obj = {}
function readFileList(path, filesList) {
    let files = fs.readdirSync(path);
    files.forEach(function (itm, index) {    
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
            obj.fileDir = files[index]  // 获取文件夹名
        } else {

            if (itm.indexOf('.js') != -1){
                // var obj = {};//定义一个对象存放文件的路径和名字
                obj.path = path;//路径
                obj.filename = itm//名字
                filesList.push(obj);
            }
        }
    })
}

let getFiles = {
    //获取文件夹下的所有文件
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
    }
};

module.exports = getFiles