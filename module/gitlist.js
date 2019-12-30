const exec = require('child_process').exec
// const command = 'git diff --name-status HEAD'
const command = 'git status -s'

module.exports = {
	getlist(path, fn) {
		const gitlist = []
		// cd F:/Gbeta1 && git status -s
		exec(`cd ${path} && ${command}`, 'utf8', (err, stdout, stderr) => {
			if (err) {
				console.log('err:', err)
				console.log('stderr:', stderr)
			} else {
				const arrList = stdout.split('\n')
				// A:新增   M：修改   D：删除    ??: 未暂存新增   R：重命名
				const arrType = ['A','M','D','??','R']
				arrList.forEach(item => {
					const str = item.replace('??', 'A').replace(/\s+/g,'')
					if (str){
						const type = str.replace(/^(.)?.*/, '$1')
						const list = str.replace(/^(.)?(.*)/, '$2').replace(/.*->(.*)$/,'$1')
						gitlist.push({
							type,
							list
						})
					}
				})
				fn && fn(gitlist)
			}
		})
	}
}