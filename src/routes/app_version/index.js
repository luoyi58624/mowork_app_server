var express = require('express')
const model = require('./model')
const multer = require('multer')

var router = express.Router()

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, './public/apk')
	},
	filename(req, file, callback) {
		callback(null, file.originalname)
	}
})

const upload = multer({
	storage,
	fileFilter: (req, file, callback) => {
		if (file.originalname.endsWith('.apk')) {
			file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
			callback(null, true)
		} else {
			callback(new Error('上传的文件类型必须为apk'))
		}
	}
})

router.get('/', async (req, res, next) => {
	res.send({
		code: 200,
		data: await model.find().sort({ versionNum: -1 }).exec()
	})
})

router.post('/upload', upload.single('file'), async (req, res, next) => {
	console.log(req.file)
	await model({
		...req.body,
		appName: req.file.originalname,
		fileSize: req.file.size,
		downloadUrl: `/apk/${req.file.originalname}`
	}).save()
	res.send({
		code: 200,
		data: '上传成功'
	})
})

router.delete('/:id', async (req, res, next) => {
	await model.deleteMany({ _id: { $in: req.params.id.split(',') } })
	res.send({
		code: 200,
		data: '删除成功'
	})
})

router.get('/newVersion', async (req, res, next) => {
	res.send({
		code: 200,
		data: await model.find().sort({ versionNum: -1 }).limit(1).exec()
	})
})

module.exports = router
