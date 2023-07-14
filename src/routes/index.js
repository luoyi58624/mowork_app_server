var express = require('express')
const { check, validationResult } = require('express-validator')
var router = express.Router()
router.get('/', async (req, res, next) => {
	res.send({
		code: 200,
		data: 'hello,node'
	})
})

router.post('/addUser', check('username', '请传入用户名').not().isEmpty(), async (req, res, next) => {
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return res.send({
			code: 500,
			data: result.array()
		})
	}
	res.send({
		code: 200,
		data: `hello,${req.body['username']}`
	})
})

router.use('/app-version', require('./app_version'))

module.exports = router
