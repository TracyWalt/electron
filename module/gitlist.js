const exec = require('child_process').exec
// const command = 'git diff --name-status HEAD'
const command = 'git status -s'

// 获取git改动清单
const getArrList = (str, type) => {
	const arr = str.split('\n')
	return arr.filter(item => {
		const regex = new RegExp(`[${type}].*`)
		if (regex.test(item)) {
			return item !== undefined
		}
	})
}

/**
 * @description 获取类型清单
 * @param {*} arr
 * @param {*} type M:修改，D：删除 A：新增 ??: 未暂存新增  R：重命名 C: 复制  U：更新但未被合并
 * @returns
 */
const formatList = (arr, type) => {
	return arr.map(item => {
		return item.replace(/\s/g, '').replace(type, '').replace(/.*->(.*)$/,'$1')
	})
}

module.exports = {
	getlist(path, fn) {
		const gitlist = []
		// cd F:/Gbeta1 && git status -s
		exec(`cd ${path} && ${command}`, 'utf8', (err, stdout, stderr) => {
			if (err) {
				console.log('err:', err)
				console.log('stderr:', stderr)
			} else {
				const typeList = ['M', 'D', 'A', '??', 'R']
				typeList.forEach(type => {
					arr = getArrList(stdout, type)
					arr = formatList(arr, type)
					if (arr.length > 0) {
						gitlist.push({
							type,
							list: arr
						})
					}
				})
				fn && fn(gitlist)
			}
		})
	}
}