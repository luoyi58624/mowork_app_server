/**
 * 判断一个对象 || 数组 || 字符串(包括空格) 是否为空
 * @example null、undefined、'undefined'、[]、''、' '
 * @param value
 * @return {boolean}
 */
function isEmpty(value) {
	if (value === null || value === undefined || value === 'undefined' || value === false) {
		return true
	} else if (Array.isArray(value)) {
		return value.length === 0
	} else if (typeof value === 'string') {
		return value.trim().length === 0
	} else {
		return false
	}
}

module.exports = {
	isEmpty
}
