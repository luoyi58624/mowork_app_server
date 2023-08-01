const qiniu = require('qiniu')

const qiniuHttp = 'http://cdn.liyi.online'

// 七牛云认证
const accessKey = 'hdUy8w7obc3Y8txW0zj4SCN5AazLNq6idz9rYVKR'
const secretKey = 'ZTRsC8HloMDAo-ngwl0kCbi-sNujHQc5c94br-7P'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

// 七牛云文件上传的空间
const qiniuBucket = 'luoyi-test'

/** 获取上传token，如果传递了文件名，则创建覆盖上传的token */
function getUploadToken(fileName) {
	let scope = qiniuBucket
	if (fileName != null) {
		scope = qiniuBucket + ':' + fileName
	}
	const putPolicy = new qiniu.rs.PutPolicy({
		scope: scope,
		expires: 300 // token有效期5分钟
	})
	const uploadToken = putPolicy.uploadToken(mac)
	return uploadToken
}

// 创建七牛云配置
const qiniuConfig = new qiniu.conf.Config()
qiniuConfig.zone = qiniu.zone.Zone_z2 // 机房所在地

// 创建七牛云空间管理
const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig)

module.exports = {
	qiniuHttp,
	qiniuBucket,
	qiniuConfig,
	bucketManager,
	getUploadToken
}
