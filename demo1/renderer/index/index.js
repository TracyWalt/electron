let child_process = require('child_process')

let oBtn = document.querySelector('.start-btn')
let root = document.querySelector('.root')
let module = document.querySelector('.module')

let rootList = document.querySelector('.root-list').querySelectorAll('li')
for (var i = 0; i < rootList.length; i++) {
    rootList[i].onclick = function () {
        for (var i = 0; i < rootList.length; i++) {
            rootList[i].className = ''
        }
        this.className = 'active'
        root.value = this.innerHTML
    }
}

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

oBtn.onclick = () => {
    console.log(root.value, module.value)
    child_process.exec(`start cmd.exe /K "cd /d E:\\${root.value}\\applications\\banggood\\templates\\black\\web&&npm run start -tpl=${module.value}"`)
}