const express = require('express')
const multer = require('multer')

const router = express.Router()

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, './public/apk')
	},
	filename(req, file, callback) {
		console.log(file)
		callback(null, file.originalname)
	}
})

const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 50
	},
	fileFilter: (req, file, callback) => {
		if (file.originalname.endsWith('.apk')) {
			file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
			callback(null, true)
		} else {
			callback(new Error('上传的文件类型必须为apk'))
		}
	}
})

router.post('/upload', upload.single('file'), async (req, res, next) => {
	res.send({
		code: 200,
		data: '上传成功'
	})
})

module.exports = router
