const express = require('express')
const {getUploadToken} = require('../utils/qiniu')
const router = express.Router()
router.get('/', async (req, res, next) => {
  res.send({
    code: 200,
    data: 'hello,' + process.env.TITLE
  })
})

router.get('/getUploadToken', async (req, res, next) => {
  res.send({
    code: 200,
    data: getUploadToken(req.query['fileName'])
  })
})

router.get('/autoDeplay', async (req, res, next) => {
  res.send({
    code: 200,
    data: '自动部署'
  })
})

router.use('/app-version', require('./app_version'))
router.use('/other', require('./other'))

module.exports = router
