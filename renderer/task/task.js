// let { net } = require('electron').remote
let { clipboard, shell } = require('electron')
let filelist = require('../../module/filelist')
let getGitList = require('../../module/gitlist')

module.exports = {
    rootDir: filelist.getConfig().rootDir,
    gitFile: [],
    params:{
        startDate: '2019-08-01',
        endDate: '2019-08-08',
        name: '杨智富',
    },
    D: {
        'taskTable': document.querySelector('.main-cnt-task').querySelector('.task-block table'),
        'updateBtn': document.querySelector('.main-cnt-task').querySelector('.update-time-btn'),
        'nameInput': document.querySelector('.main-cnt-task').querySelector('.name'),
        'startTimeInput': document.querySelector('.main-cnt-task').querySelector('.start-time'),
        'endTimeInput': document.querySelector('.main-cnt-task').querySelector('.end-time'),
        'entrySuc': document.querySelector('.entry-success'),
        'gitSelect': document.querySelector('.main-cnt-task').querySelector('.git-list-select'),
        'gitSelectText': document.querySelector('.main-cnt-task').querySelector('.git-list-select .select-text'),
        'gitSelectList': document.querySelector('.main-cnt-task').querySelector('.git-list-select .select-list'),
        'gitTable': document.querySelector('.main-cnt-task').querySelector('.git-block table'),
        'copyListBtn': document.querySelector('.main-cnt-task').querySelector('.copy-list-btn'),
    },
    init() {
        this.initParams()
        this.ajaxData()
        this.update()
        this.copy()
        this.gitSelect()
    },
    // 初始化参数,根据系统时间获取当日所属月份 1号到当日的数据
    initParams() {
        const S = this
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()+1
        // 获取当月最后一天
        let day = new Date(year, month, 0).getDate() 
        let curStartTime = `${year}-${S.addZreo(month)}-01`
        let curEndTime = `${year}-${S.addZreo(month)}-${S.addZreo(day)}`
        S.D.startTimeInput.value = curStartTime
        S.D.endTimeInput.value = curEndTime
        S.params.startDate = curStartTime
        S.params.endDate = curEndTime
        S.params.name = S.D.nameInput.value

        // 初始化日历
        layui.use('laydate', () => {
            let laydate = layui.laydate

            laydate.render({
                elem: '#taskStime',
                theme: '#269a55'
            })

            laydate.render({
                elem: '#taskEtime',
                theme: '#269a55'
            })
        })
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
                S.D.taskTable.style.opacity = '1'
            }
        }
    },
    createList(data) {
        const S = this
        // 按日期升序排序
        data.rows = data.rows.sort((a, b) => {
            return b.plan_enddate.replace(/-/g,'') - a.plan_enddate.replace(/-/g,'')
        })
        console.log(data)
        // 绘制表头
        let tr = '<th>任务</th><th>需求</th><th>完成日期</th><th>处理人</th><th>操作</th>'
        // 绘制列表
        let td = ''
        if(data && data.rows.length > 0){
            data.rows.forEach((item,index) => {
                td += '<tr>'
                td += '<td class="aleft"><a href="javascript:;" class="open-link" data-url="'+item.task_url+'" target="_blank">'+item.task_name+'</a></td>'
                td += '<td class="aleft"><a href="javascript:;" class="open-link" data-url="'+item.story_url+'" target="_blank">'+item.story_name+'</a></td>'
                td += '<td class="gray">'+item.plan_enddate+'</td>'
                td += '<td class="gray">'+item.handler+'</td>'
                td += '<td><a href="javascript:;" class="copy-url" data-task-name="'+item.task_name+'" data-story-tid="'+item.story_tid+'" data-task-url="'+item.task_url+'" data-story-url="'+item.story_url+'">复制源码关键字</a></td>'
                td += '</tr>'
            })
            
        } else {
            td = '<tr><td colspan="5" class="init">暂无数据</td></tr>'
        }
        // 插入数据
        S.D.taskTable.innerHTML = tr + td
        S.D.taskTable.style.opacity = '1'
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
            S.D.taskTable.style.opacity = '0.6'
        }
    },
    copy() {
        const S = this
        // 复制源码关键字
        S.D.taskTable.onclick = function(e){
            // 复制粘贴板
            if (e.target.className == 'copy-url') {
                let taskUrl = e.target.getAttribute('data-task-url')
                let taskName = e.target.getAttribute('data-task-name').substring(0, 12)
                let storyTid = taskUrl.replace(/.*\/(\d+)$/,'$1')
                storyTid = storyTid.substring(storyTid.length-7)
                let sourceText = `--task=${storyTid} --user=${S.params.name} ${taskName}... ${taskUrl}`
                clipboard.writeText(sourceText)
                S.D.entrySuc.innerHTML = '<span>已复制到粘贴板</span>'
                S.D.entrySuc.style.display = 'block'
                setTimeout(() => {
                    S.D.entrySuc.style.display = 'none'
                }, 2000)
            }
            // 打开链接
            if (e.target.className == 'open-link') {
                let taskUrl = e.target.getAttribute('data-url')
                shell.openExternal(taskUrl)
                return false
            }
        }

        // 复制git修改列表
        S.D.copyListBtn.onclick = function(){
            if(!S.gitFile.length)return;
            clipboard.writeText(S.gitFile.join('\n'))
            S.D.entrySuc.innerHTML = '<span>已复制到粘贴板</span>'
            S.D.entrySuc.style.display = 'block'
            setTimeout(() => {
                S.D.entrySuc.style.display = 'none'
            }, 2000)
        }
    },
    gitSelect() {
        const S = this
        // 生成列表
        let listArr = localStorage.getItem('roodirArr') ? localStorage.getItem('roodirArr').split(',') : []
        let dd = ''
        listArr.forEach((item) => {
            dd += '<dd>'+item+'</dd>'
        })
        S.D.gitSelectList.innerHTML = dd

        S.D.gitSelectText.onclick = function (e) {
            S.D.gitSelectList.style.display = 'block'
            e.stopPropagation()
        }

        S.D.gitSelect.onclick = function (e) {
            if (e.target.nodeName.toLocaleLowerCase() == 'dd') {
                let val = e.target.innerText
                S.D.gitSelectText.innerText = val
                S.D.gitSelectList.style.display = 'none'
                S.loading()
                S.updateGitlist(val)
            }
        }

        document.onclick = function () {
            S.D.gitSelectList.style.display = 'none'
        }
    },
    updateGitlist(path) {
        const S = this
        S.gitFile = []
        getGitList.getlist(S.rootDir+path, (list) => {
            // 绘制表头
            let tr = '<th>路径</th><th>状态</th>'
            // 绘制列表
            let td = ''
            let zhName = {
                'D': '删除',
                'M': '修改',
                'R': '新增',
                'A': '新增',
                '??': '新增'
            }
            let clsName = {
                'D': 'd',
                'M': 'm',
                'R': 'a',
                'A': 'a',
                '??': 'a'
            }
            list.forEach((item,index) => {
                td += '<tr>'
                td += '<td class="'+clsName[item.type]+'"><span>'+item.list+'</span></td>'
                td += '<td class="'+clsName[item.type]+'"><span>'+zhName[item.type]+'</span></td>'
                td += '</tr>'

                S.gitFile.push(item.list)
            })
            if(!td){
                td += '<tr><td colspan="2" class="init">暂无修改文件</td></tr>'
            }
            // 插入数据
            S.D.gitTable.innerHTML = tr + td
        })
    },
    loading() {
        const S = this
        // 绘制表头
        let tr = '<th>路径</th><th>状态</th>'
        // 绘制列表
        let td = '<tr><td colspan="2" class="init">列表加载中...</td></tr>'
        // 插入数据
        S.D.gitTable.innerHTML = tr + td
    },
}
