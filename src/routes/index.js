const express = require('express')
const { getUploadToken } = require('../utils/qiniu')
const router = express.Router()
router.get('/', async (req, res, next) => {
	res.send({
		code: 200,
		data: 'hello,测试自动化部署'
	})
})

router.get('/getUploadToken', async (req, res, next) => {
	res.send({
		code: 200,
		data: getUploadToken(req.query['fileName'])
	})
})

router.use('/app-version', require('./app_version'))

module.exports = router
