const express = require('express')

const router = express.Router()

router.use('', require('./upload'))
router.use('', require('./common'))

module.exports = router
