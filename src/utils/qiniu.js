const qiniu = require('qiniu')

const qiniuHttp = 'http://cdn.liyi.online'
// 七牛云认证
const accessKey = 'hdUy8w7obc3Y8txW0zj4SCN5AazLNq6idz9rYVKR'
const secretKey = 'ZTRsC8HloMDAo-ngwl0kCbi-sNujHQc5c94br-7P'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

function getUploadToken(fileName) {
	// 创建上传token
	const putPolicy = new qiniu.rs.PutPolicy({
		scope: 'luoyi-test:' + fileName // 空间名
	})
	const uploadToken = putPolicy.uploadToken(mac)
	return uploadToken
}
// 创建七牛云配置
const qiniuConfig = new qiniu.conf.Config()
qiniuConfig.zone = qiniu.zone.Zone_z2 // 机房所在地

module.exports = {
	qiniuHttp,
	qiniuConfig,
	getUploadToken
}
