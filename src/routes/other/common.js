const express = require('express')
const { convertHtmlToDelta, convertTextToDelta } = require('node-quill-converter')

const router = express.Router()

router.get('/htmlToDelta', async (req, res, next) => {
	// console.log(req.query['html'])
	// const deltaData = convertTextToDelta(req.query['html'])
	const deltaData = convertHtmlToDelta(req.query['html'])
	const deltaStr = JSON.stringify(deltaData)
	// console.log(deltaData)
	// console.log(deltaStr)
	// console.log(JSON.parse(deltaStr))
	// console.log(JSON.parse(deltaStr)['ops'])
	res.send({
		code: 200,
		data: JSON.stringify(JSON.parse(deltaStr)['ops'])
	})
})

module.exports = router
