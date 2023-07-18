const express = require('express')
const router = express.Router()
router.get('/', async (req, res, next) => {
	res.send({
		code: 200,
		data: 'hello,node,测试一下自动化部署'
	})
})

router.use('/app-version', require('./app_version'))

module.exports = router
