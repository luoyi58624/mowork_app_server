var express = require('express')
const model = require('./model')
const multer = require('multer')
const { check, validationResult } = require('express-validator')
const { isEmpty } = require('../../utils/common')

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

router.post(
	'/',
	upload.single('file'),
	[check('versionName', '请传入版本名字').notEmpty(), check('versionNum', '请传入版本号').notEmpty()],
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
			appName: req.file.originalname,
			fileSize: req.file.size,
			downloadUrl: `/apk/${req.file.originalname}`
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
	[check('_id', '请传入_id').notEmpty(), check('versionName', '请传入版本名字').notEmpty(), check('versionNum', '请传入版本号').notEmpty()],
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
			appName: req.file.originalname,
			fileSize: req.file.size,
			downloadUrl: `/apk/${req.file.originalname}`
		}).save()
		// const target = await model.findOne({ _id: req.body._id })
		// await target.updateOne({
		// 	...req.body,
		// 	appName: req.file.originalname,
		// 	fileSize: req.file.size,
		// 	downloadUrl: `/apk/${req.file.originalname}`
		// })
		res.send({
			code: 200,
			data: '更新成功'
		})
	}
)

const editForm = async (req, res, type) => {
	const result = validationResult(req)
	if (!result.isEmpty()) {
		return res.send({
			code: 500,
			msg: result.array()
		})
	}

	const data = {
		...req.body,
		appName: req.file.originalname,
		fileSize: req.file.size,
		downloadUrl: `/apk/${req.file.originalname}`
	}
	type == 0 ? await model(data).save() : await model(data)
	res.send({
		code: 200,
		data: '上传成功'
	})
}

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
