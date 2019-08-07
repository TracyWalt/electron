let { net } = require('electron').remote

module.exports = {
    init() {
        this.ajaxData()
    },
    ajaxData() {
        let data = ''
        const request = net.request('http://172.16.4.2/api/spent_on_tasks?dept=前端开发平台&from=2019-08-01&to=2019-08-08')

        request.on('response', (response) => {

            response.on('data', (chunk) => {
                data += `${chunk}`
            })
            response.on('end', () => {
                console.log(JSON.parse(data))
            })
        })
        request.end()     
    },
}
