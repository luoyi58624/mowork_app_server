var express = require('express')
const AppVersionModel = require('../models/app_version')
const formidable = require('formidable')
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
			callback(null, true)
		} else {
			callback(new Error('上传的文件类型必须为apk'))
		}
	}
})

router.get('/', async (req, res, next) => {
	console.log('小号测试');
	res.send({
		code: 200,
		data: await AppVersionModel.find().sort({ versionNum: -1 }).exec()
	})
})

router.post('/upload', upload.single('file'), async (req, res, next) => {
	console.log(req.file)
	await AppVersionModel({
		...req.body,
		appName: req.file.originalname,
		downloadUrl: `/apk/${req.file.originalname}`
	}).save()
	res.send({
		code: 200,
		data: '上传成功'
	})
})

router.delete('/:id', async (req, res, next) => {
	console.log(req.file)
	await AppVersionModel.deleteOne({ _id: req.params.id })
	res.send({
		code: 200,
		data: '删除成功'
	})
})

router.get('/newVersion', async (req, res, next) => {
	res.send({
		code: 200,
		data: await AppVersionModel.find().sort({ versionNum: -1 }).limit(1).exec()
	})
})

module.exports = router
