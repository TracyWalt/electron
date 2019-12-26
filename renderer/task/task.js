// let { net } = require('electron').remote
let { clipboard } = require('electron')

module.exports = {
    params:{
        startDate: '2019-08-01',
        endDate: '2019-08-08',
        name: '杨智富',
    },
    D: {
        'table': document.querySelector('.main-cnt-task').querySelector('table'),
        'updateBtn': document.querySelector('.main-cnt-task').querySelector('.update-time-btn'),
        'nameInput': document.querySelector('.main-cnt-task').querySelector('.name'),
        'startTimeInput': document.querySelector('.main-cnt-task').querySelector('.start-time'),
        'endTimeInput': document.querySelector('.main-cnt-task').querySelector('.end-time'),
        'entrySuc': document.querySelector('.entry-success'),
    },
    init() {
        this.initParams()
        this.ajaxData()
        this.update()
        this.copyUrl()
    },
    // 初始化参数,根据系统时间获取当日所属月份 1号到当日的数据
    initParams() {
        const S = this
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()
        let curStartTime = `${year}-${S.addZreo(month)}-01`
        let curEndTime = `${year}-${S.addZreo(month)}-${S.addZreo(day)}`
        S.D.startTimeInput.value = curStartTime
        S.D.endTimeInput.value = curEndTime
        S.params.startDate = curStartTime
        S.params.endDate = curEndTime
        S.params.name = S.D.nameInput.value
    },
    ajaxData() {
        const S = this
        const xhr = new XMLHttpRequest()
        xhr.open('GET',`http://172.16.4.2/api/tasks_finished_at?emps=${S.params.name}&from=${S.params.startDate}&to=${S.params.endDate}`,true)
        xhr.send()
        xhr.onreadystatechange=function(){
            if(xhr.readyState===4){
                if(xhr.status===200){
                    setTimeout(() => {
                        S.createList(JSON.parse(xhr.responseText))
                    }, 1000)
                }else{
                    console.log('ajax error...')
                }
                S.D.table.style.opacity = '1'
            }
        }
    },
    createList(data) {
        const S = this
        if(data && data.rows.length > 0){
            // 绘制表头
            let tr = '<th>标题</th><th>需求</th><th>处理人</th><th>操作</th>'
            // 绘制列表
            let td = ''
            data.rows.forEach((item,index) => {
                td += '<tr>'
                td += '<td><a href="'+item.task_url+'" target="_blank">'+item.task_name+'</a></td>'
                td += '<td><a href="'+item.story_url+'" target="_blank">'+item.story_name+'</a></td>'
                td += '<td>'+item.handler+'</td>'
                td += '<td><a href="javascript:;" class="copy-url" data-task-name="'+item.task_name+'" data-story-tid="'+item.story_tid+'" data-task-url="'+item.task_url+'" data-story-url="'+item.story_url+'">复制源码关键字</a></td>'
                td += '</tr>'
            })
            // 插入数据
            S.D.table.innerHTML = tr + td
            S.D.table.style.opacity = '1'
        }
    },
    addZreo(num) {
        return num*1 >= 10 ? `${'' + num}` : `0${num}`
    },
    update() {
        const S = this
        S.D.updateBtn.onclick = () => {
            S.params.startDate = S.D.startTimeInput.value
            S.params.endDate = S.D.endTimeInput.value
            S.ajaxData()
            S.D.table.style.opacity = '0.6'
        }
    },
    copyUrl() {
        const S = this
        S.D.table.onclick = function(e){
            if (e.target.className == 'copy-url') {
                let taskUrl = e.target.getAttribute('data-task-url')
                let taskName = e.target.getAttribute('data-task-name').substring(0, 12)
                let storyTid = taskUrl.replace(/.*\/(\d+)$/,'$1').split('00')
                let sourceText = `--task=${storyTid[1]} --user=${S.params.name} ${taskName}... ${taskUrl}`
                clipboard.writeText(sourceText)
                S.D.entrySuc.innerHTML = '<span>已复制到粘贴板</span>'
                S.D.entrySuc.style.display = 'block'
                setTimeout(() => {
                    S.D.entrySuc.style.display = 'none'
                }, 2000)
            }
        }
    },
}
