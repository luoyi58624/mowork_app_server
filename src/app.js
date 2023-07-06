const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')
require('express-async-errors')

dotenv.config()

const app = express()
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // 解析表单数据
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
	console.log(err)
	if (err instanceof Error) {
		res.status(500).send({
			code: 0,
			msg: err.message
		})
	} else {
		res.status(500).send({
			code: 0,
			msg: '服务内部错误'
		})
	}
})

module.exports = app
