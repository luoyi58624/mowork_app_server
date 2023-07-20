const express = require('express')
const model = require('./model')
const multer = require('multer')
const qiniu = require('qiniu')
const stream = require('stream')

const { check, validationResult } = require('express-validator')
const { isEmpty } = require('../../utils/common')
const { qiniuHttp, qiniuConfig, getUploadToken } = require('../../utils/qiniu')

const router = express.Router()

// const storage = multer.diskStorage({
// 	destination(req, file, callback) {
// 		callback(null, './public/apk')
// 	},
// 	filename(req, file, callback) {
// 		console.log(req.body)
// 		// callback(null, req.body.appName)
// 		callback(null, req.body.appName)
// 	}
// })
const storage = multer.memoryStorage()
const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 50
	},
	fileFilter: (req, file, callback) => {
		if (file.originalname.endsWith('.apk')) {
			console.log(req.body)
			// console.log(file)
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
		console.log(req.file)
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

		const formUploader = new qiniu.form_up.FormUploader(qiniuConfig)
		const putExtra = new qiniu.form_up.PutExtra()
		const uploadToken = getUploadToken(req.body['appName'])
		// const bufferStream = new stream.PassThrough()
		// const streams = bufferStream.end(req.file.buffer)
		// console.log(streams)
		// 以二进制流的形式上传
		formUploader.putStream(
			uploadToken,
			req.body['appName'],
			stream.Readable.from(req.file.buffer),
			// req.file.buffer.toString(),
			putExtra,
			async function (respErr, respBody, respInfo) {
				if (respErr) {
					throw respErr
				}
				if (respInfo.statusCode == 200) {
					await model({
						...req.body,
						fileSize: req.file.size,
						downloadUrl: `${qiniuHttp}/${req.body.appName}`
					}).save()
					res.send({
						code: 200,
						data: '上传成功'
					})
				} else {
					res.send({
						code: 500,
						data: '七牛云上传失败'
					})
				}
			}
		)
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
