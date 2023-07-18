const express = require('express')
const model = require('./model')
const multer = require('multer')
const { check, validationResult } = require('express-validator')
const { isEmpty } = require('../../utils/common')

const router = express.Router()

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, './public/apk')
	},
	filename(req, file, callback) {
		console.log(req.body)
		callback(null, req.body.appName)
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
		data: await model.find().sort({ versionCode: -1 }).exec()
	})
})

router.post(
	'/',
	upload.single('file'),
	[
		check('appName', '请传入App名字').notEmpty(),
		check('versionName', '请传入版本名字').notEmpty(),
		check('versionCode', '请传入版本号').notEmpty()
	],
	async (req, res, next) => {
		if (isEmpty(req.file)) {
			return res.send({
				code: 500,
				msg: '请传入文件'
			})
		}
		const result = validationResult(req)
		if (!result.isEmpty()) {
			return res.send({
				code: 500,
				msg: result.array()
			})
		}
		await model({
			...req.body,
			fileSize: req.file.size,
			downloadUrl: `/apk/${req.body.appName}`
		}).save()
		res.send({
			code: 200,
			data: '上传成功'
		})
	}
)

router.put(
	'/',
	upload.single('file'),
	[
		check('_id', '请传入_id').notEmpty(),
    check('appName', '请传入App名字').notEmpty(),
		check('versionName', '请传入版本名字').notEmpty(),
		check('versionCode', '请传入版本号').notEmpty()
	],
	async (req, res, next) => {
		const result = validationResult(req)
		if (!result.isEmpty()) {
			return res.send({
				code: 500,
				msg: result.array()
			})
		}

		await model.findByIdAndUpdate(req.body['_id'], {
			...req.body,
			fileSize: req.file?.size ?? undefined,
			downloadUrl: req.body.appName ? `/apk/${req.body.appName}` : undefined
		})
		res.send({
			code: 200,
			data: '更新成功'
		})
	}
)

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
		data: await model.findOne().sort({ versionCode: -1 }).exec()
	})
})

module.exports = router
