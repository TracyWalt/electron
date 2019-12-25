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
        'entryDialog': document.querySelector('.entry-dialog'),
        'entryMask': document.querySelector('.entry-dialog .mask'),
        'entryVal': document.querySelector('.entry-val'),
        'entryBtn': document.querySelector('.entry-btn'),
        'entrySuc': document.querySelector('.entry-success'),
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
                    // 查看文档
                    if(clsName.indexOf('doc-btn') != -1){
                        path += `web&&npm run doc`
                    }
                    // stylelint fix
                    if(clsName.indexOf('stylelint-btn') != -1){
                        path += `web&&npm run stylelint`
                    }
                    // eslint fix
                    if(clsName.indexOf('eslint-btn') != -1){
                        path += `web&&npm run lint`
                    }
                    // 新建入口弹窗
                    if(clsName.indexOf('newentry-btn') != -1){
                        S.D.entryDialog.style.display = 'block'
                    } else {
                        child_process.exec(`start cmd.exe /K "cd /d ${path}"`)
                    }
                    console.log(path)
                }
            }
        })

        // 新建入口
        S.D.entryBtn.onclick = function () {
            let val = S.D.entryVal.value
            if (val) {
                let rootPath = `${S.D.root.value}web/`
                let pathArr = val.split('/')
                let templatesPath = `${rootPath}templates/`
                let devEntryPath = `${rootPath}dev/entry/`
                // 创建模板文件夹
                if (!fs.existsSync(`${templatesPath}${pathArr[0]}`)) {
                    // 不存在则创建
                    fs.mkdirSync(`${templatesPath}${pathArr[0]}`)
                }
                // 创建入口文件夹
                if (!fs.existsSync(`${devEntryPath}${pathArr[0]}`)) {
                    // 不存在则创建
                    fs.mkdirSync(`${devEntryPath}${pathArr[0]}`)
                    // 同时创建 css img 文件夹
                    fs.mkdirSync(`${devEntryPath}${pathArr[0]}/css`)
                    fs.mkdirSync(`${devEntryPath}${pathArr[0]}/img`)
                }

                // 创建模板文件
                let filePath = pathArr.length > 1 ? val : `${val}/${val}`
                try {
                    // 入口文件路径存在
                    fs.statSync(`${templatesPath}${filePath}.html`)
                } catch (error) {
                    // 不存在则创建
                    fs.writeFileSync(`${templatesPath}${filePath}.html`, '', {'flag': 'w'}, (err) => {
                        if (err) {
                            console.log('模板 文件写入失败')
                        }
                    })
                    console.log(`创建html文件成功:${templatesPath}${filePath}.html`)
                }

                // 创建入口文件
                try {
                    // 入口文件路径存在
                    fs.statSync(`${devEntryPath}${filePath}.js`)
                } catch (error) {
                    // 不存在则创建
                    fs.writeFileSync(`${devEntryPath}${filePath}.js`, '', {'flag': 'w'}, (err) => {
                        if (err) {
                            console.log('入口js 文件写入失败')
                        }
                    })
                    console.log(`创建js文件成功:${devEntryPath}${filePath}.js`)

                    fs.writeFileSync(`${devEntryPath}${pathArr[0]}/css/${pathArr[1] || pathArr[0]}.scss`, '', {'flag': 'w'}, (err) => {
                        if (err) {
                            console.log('入口css 文件写入失败')
                        }
                    })
                    console.log(`创建scss文件成功:${devEntryPath}${pathArr[0]}/css/${pathArr[1] || pathArr[0]}.scss`)
                }
                S.D.entryDialog.style.display = 'none'
                S.D.entrySuc.style.display = 'block'
                setTimeout(() => {
                    S.D.entrySuc.style.display = 'none'
                }, 2000)
            }
        }
        S.D.entryMask.onclick = function () {
            S.D.entryDialog.style.display = 'none'
        }
    },
}

index.init()

