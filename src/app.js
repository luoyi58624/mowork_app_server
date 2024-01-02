const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const { MulterError } = require('multer')
require('express-async-errors')
require('./ws/im')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())
app.use(express.static('./public'))

app.use('/', require('./routes/index'))

app.use(function (req, res, next) {
	res.status(404).send({
		code: 404,
		msg: '未知接口'
	})
})

app.use(function (err, req, res, next) {
	// console.log(err, '全局错误拦截')
	if (err.constructor === MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			res.status(200).send({
				code: 500,
				msg: '上传的文件尺寸超出限制'
			})
		} else {
			res.status(200).send({
				code: 500,
				msg: err.message
			})
		}
	} else if (err.constructor === Error) {
		res.status(200).send({
			code: 500,
			msg: err.message
		})
	} else {
		res.status(200).send({
			code: 500,
			msg: '服务内部错误'
		})
	}
})

module.exports = app
