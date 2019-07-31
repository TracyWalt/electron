// 引入node模块
let child_process = require('child_process')
let fs = require('fs')
let filelist = require('./module/filelist')

// 获取页面元素
let oBtn = document.querySelector('.start-btn')
let root = document.querySelector('.root')
let rootUl = document.querySelector('.root-list')
let module = document.querySelector('.module')
let moduleUl = document.querySelector('.module-list')

// 设置根目录
// let rootDir = 'E:/web/'
let rootDir = 'E:/'

// 读取，并动态生成测试环境目录
fs.readdir(rootDir, (err, files) => {
    if (err) {
      return console.log('目录不存在')
    }

    // 对文件夹进行排序
    var newFiles = files.sort((a, b) => {
        return a.replace(/\D+/,'') - b.replace(/\D+/,'')
    })

    let oLi = ''
    newFiles.map((item) => {
        // 过滤非目标文件夹
        if (item.toLocaleLowerCase().indexOf('gbeta') != -1 || item.toLocaleLowerCase() == 'pub') {      
            oLi += `<li>${item}</li>`
        }
    })
    rootUl.innerHTML = oLi   
})


// 绑定事件
rootUl.onclick = function (e) {
    if (e.target.nodeName.toLocaleLowerCase() == 'li') {
        if (e.target.className == 'active') return
        let rootList = rootUl.querySelectorAll('li')
        for (var i = 0; i < rootList.length; i++) {
            rootList[i].className = ''
        }
        e.target.className = 'active'
        root.value = e.target.innerHTML
        
        // 动态生成模块列表
        let moduleFolder = filelist.getFileList(`${rootDir}${e.target.innerHTML}/applications/banggood/templates/black/web/dev/entry/`)
        // console.log(moduleFolder);
        let oLi = ''
        moduleFolder.map((item) => {
            oLi += `<li>${item.foldername}/${item.filename.replace('.js','')}</li>`
        })
        moduleUl.innerHTML = oLi || '该环境没有符合的模块'
        module.value = ''
        oBtn.className = 'start-btn'
    }
}

moduleUl.onclick = function (e) {
    if (e.target.nodeName.toLocaleLowerCase() == 'li') {
        let moduleList = moduleUl.querySelectorAll('li')
        for (var i = 0; i < moduleList.length; i++) {
            moduleList[i].className = ''
        }
        e.target.className = 'active'
        module.value = e.target.innerHTML
        oBtn.className = 'start-btn active'
    }
}

// 启动
oBtn.onclick = function () {
    if (this.className.indexOf('active') != -1) {
        let path = `${rootDir}${root.value}/applications/banggood/templates/black/web&&npm run start -tpl=${module.value}`
        console.log(path)
        child_process.exec(`start cmd.exe /K "cd /d ${path}"`)
    }
}