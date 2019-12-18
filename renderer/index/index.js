// 引入node模块
let child_process = require('child_process')
let fs = require('fs')
let filelist = require('./module/filelist')
let router = require('./renderer/router/router')
let settings = require('./renderer/settings/settings')

let index = {
    rootDir: filelist.getConfig().rootDir,
    folder: filelist.getConfig().folder,
    D: {
        'oBtn': document.querySelector('.start-btn'),
        'root': document.querySelector('.root'),
        'rootUl': document.querySelector('.root-list'),
        'module': document.querySelector('.module'),
        'moduleUl': document.querySelector('.module-list'),
        'oBtnAll': document.querySelectorAll('.btn'),
        'moduleFilterInput': document.querySelector('.module-filter'),
    },
    init() {
        router.init()
        settings.init()
        this.createRootList()
        this.bindEvent()
    },
    // 读取，并动态生成环境列表
    createRootList() {
        const S = this
        fs.readdir(S.rootDir, (err, files) => {
            if (err) {
              return console.log('目录不存在')
            }
        
            // 对文件夹进行排序
            let newFiles = files.sort((a, b) => {
                return a.replace(/\D+/,'') - b.replace(/\D+/,'')
            })
        
            let oLi = ''
            let folderArr = S.folder.split(';')
            newFiles.map((item) => {
                // 过滤非目标文件夹
                if(S.folder){
                    let isHas = false
                    folderArr.map((f) => {
                        if(item.toLocaleLowerCase() == f.toLocaleLowerCase()){
                            isHas = true
                            return false
                        }
                    })
                    if (!isHas) {      
                        oLi += `<li>${item}</li>`
                    }
                }else{
                    oLi += `<li>${item}</li>`
                }
            })
            S.D.rootUl.innerHTML = oLi   
        })
    },
    // 绑定事件
    bindEvent() {
        const S = this
        // 选择环境
        S.D.rootUl.onclick = function (e) {
            if (e.target.nodeName.toLocaleLowerCase() == 'li') {
                if (e.target.className == 'active') return
                let rootList = S.D.rootUl.querySelectorAll('li')
                for (let i = 0; i < rootList.length; i++) {
                    rootList[i].className = ''
                }
                e.target.className = 'active'

                // gbeta目录下是否还有 www目录
                let __url = `${S.rootDir}${e.target.innerHTML}/applications/banggood/templates/black/`
                let www = fs.readdirSync(`${S.rootDir}${e.target.innerHTML}`)[0]
                if(www == 'www'){
                    __url = `${S.rootDir}${e.target.innerHTML}/www/applications/banggood/templates/black/`
                }
                S.D.root.value = __url
                __url += 'web/dev/entry/'

                // 动态生成模块列表
                let moduleFolder = filelist.getFileList(__url)
                let oLi = ''
                moduleFolder.map((item) => {
                    oLi += `<li>${item.foldername}/${item.filename.replace('.js','')}</li>`
                })
                S.D.moduleUl.innerHTML = oLi || '该环境没有符合的模块'
                S.D.module.value = ''
                S.D.oBtn.className = 'btn start-btn'

                // 其他按钮只需选中环境即可点击执行
                S.D.oBtnAll.forEach(function(item) {
                    let clsName = item.className;
                    if(clsName.indexOf('start-btn') == -1){
                        item.className = `${clsName} active`
                    }
                })
            }
        }

        // 选择模块
        S.D.moduleUl.onclick = function (e) {
            if (e.target.nodeName.toLocaleLowerCase() == 'li') {
                let moduleList = S.D.moduleUl.querySelectorAll('li')
                for (let i = 0; i < moduleList.length; i++) {
                    moduleList[i].className = ''
                }
                e.target.className = 'active'
                S.D.module.value = e.target.innerHTML
                S.D.oBtn.className = 'btn start-btn active'
            }
        }

        // 过滤模块
        S.D.moduleFilterInput.onkeyup = function () {
            let val = this.value
            S.D.moduleUl.querySelectorAll('li').forEach((item)=>{
                let text = item.innerHTML
                item.style.display = 'none'
                if(text.indexOf(val) != -1){
                    item.style.display = 'block'
                }
            })
        }

        // 执行命令
        S.D.oBtnAll.forEach((item) => {
            item.onclick = () => {
                let clsName = item.className
                let path = S.D.root.value
                if (clsName.indexOf('active') != -1) {
                    // 新工程本地开发启动
                    if(clsName.indexOf('start-btn') != -1){
                        path += `web&&npm run start -tpl=${S.D.module.value}`
                    }
                    // 新工程sprite
                    if(clsName.indexOf('sprite-btn') != -1){
                        path += `web&&npm run sprite`
                    }
                    // 新工程build
                    if(clsName.indexOf('build-btn') != -1){
                        path += `web&&npm run build`
                    }
                    // 旧工程详情页build
                    if(clsName.indexOf('build-detail-btn') != -1){
                        path += `detail/develop&&node r.js -o build.js`
                    }
                    // 旧工程搜索页build
                    if(clsName.indexOf('build-search-btn') != -1){
                        path += `search&&npm run build`
                    }
                    console.log(path)
                    child_process.exec(`start cmd.exe /K "cd /d ${path}"`)
                }
            }
        })
    },
}

index.init()

