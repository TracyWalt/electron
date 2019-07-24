let child_process = require('child_process')

let oBtn = document.querySelector('#btn')

oBtn.onclick = () => {
    child_process.exec('start cmd.exe /K "cd E:\\project\\gulp&&gulp"')
}