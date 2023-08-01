const express = require('express')
const model = require('./model')
const multer = require('multer')
const qiniu = require('qiniu')
const stream = require('stream')

const { check, validationResult } = require('express-validator')
const { isEmpty } = require('../../utils/common')
const { qiniuHttp, qiniuConfig, getUploadToken, bucketManager, qiniuBucket } = require('../../utils/qiniu')

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 50
	},
	fileFilter: (req, file, callback) => {
		if (file.originalname.endsWith('.apk')) {
			console.log(req.body)
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
	[
		check('appName', '请传入App名字').notEmpty(),
		check('versionName', '请传入版本名字').notEmpty(),
		check('versionCode', '请传入版本号').notEmpty(),
		check('fileSize', '请传入上传的文件大小').notEmpty()
	],
	async (req, res, next) => {
		const result = validationResult(req)
		if (!result.isEmpty()) {
			return res.send({
				code: 500,
				msg: result.array()
			})
		}
		await model({
			...req.body,
			downloadUrl: `${qiniuHttp}/${req.body.appName}`
		}).save()
		res.send({
			code: 200,
			data: '添加成功'
		})
	}
)

router.put(
	'/',
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
      downloadUrl: `${qiniuHttp}/${req.body.appName}`
		})
		res.send({
			code: 200,
			data: '更新成功'
		})
	}
)

router.delete('/:id', async (req, res, next) => {
	const ids = req.params.id.split(',')
	const datas = await model.find({ _id: { $in: ids } })
	const names = datas.map(item => item.appName)
	names.forEach(name => {
		bucketManager.delete(qiniuBucket, name, (err, respBody, respInfo) => {
			if (err) {
				console.log(err)
			} else {
				console.log(respInfo, '七牛云文件删除成功')
			}
		})
	})
	await model.deleteMany({ _id: { $in: ids } })
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
