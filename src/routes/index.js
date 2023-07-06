var express = require('express')
const formidable = require('formidable')
var router = express.Router()

router.get('/', async (req, res, next) => {
	res.send({
		code: 200,
		data: 'hello,node'
	})
})

router.use('/app-version', require('./app_version'))

module.exports = router
