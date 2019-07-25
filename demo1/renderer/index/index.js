// 引入node模块
let child_process = require('child_process')
let fs = require('fs')
let getDir = require('./module/getDir')

// 获取页面元素
let oBtn = document.querySelector('.start-btn')
let root = document.querySelector('.root')
let module = document.querySelector('.module')




let moduleList = document.querySelector('.module-list').querySelectorAll('li')
for (var i = 0; i < moduleList.length; i++) {
    moduleList[i].onclick = function () {
        for (var i = 0; i < moduleList.length; i++) {
            moduleList[i].className = ''
        }
        this.className = 'active'
        module.value = this.innerHTML
    }
}


let rootDir = 'E:/web/'


fs.readdir(rootDir, function (err, files) {
    if (err) {
      return console.log('目录不存在')
    }

    let rootUl = document.querySelector('.root-list')

    let oLi = ''
    let firstDir = ''
    files.map((item,i) => {
        if (i == 0) {
            firstDir = item
        }
        oLi += `<li ${i == 0 ? 'class="active"' : ''}>${item}</li>`
    })
    rootUl.innerHTML = oLi
    console.log(getDir.getFileList(`${rootDir}/${firstDir}/applications/banggood/templates/black/web/entry/`))
    // fs.readdir(`${rootDir}/${firstDir}/applications/banggood/templates/black/web/entry`, function (err, files) {
    //     if (err) {
    //         return console.log('目录不存在')
    //     }
    //     // console.log(files)
    // })

    // 绑定事件
    let rootList = rootUl.querySelectorAll('li')
    for (var i = 0; i < rootList.length; i++) {
        rootList[i].onclick = function () {
            for (var i = 0; i < rootList.length; i++) {
                rootList[i].className = ''
            }
            this.className = 'active'
            root.value = this.innerHTML
        }
    }

})

// 启动
oBtn.onclick = () => {
    console.log(root.value, module.value)
    child_process.exec(`start cmd.exe /K "cd /d E:\\${root.value}\\applications\\banggood\\templates\\black\\web&&npm run start -tpl=${module.value}"`)
}