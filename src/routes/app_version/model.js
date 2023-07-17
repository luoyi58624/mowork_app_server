const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AppVersionModel = mongoose.model(
	'app_version',
	new Schema({
		appName: {
			type: String,
			required: true
		},
		versionName: {
			type: String,
			required: true
		},
		versionCode: {
			type: Number,
			required: true
		},
		updateDesc: {
			type: Array,
			default: () => []
		},
		downloadUrl: {
			type: String,
			default: ''
		}
	})
)

module.exports = AppVersionModel
