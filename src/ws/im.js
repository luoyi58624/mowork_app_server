const WebSocket = require('ws')

const imWs = new WebSocket.Server({ port: 3002 })

imWs.on('open', function open() {
	console.log('创建im socket')
})

imWs.on('close', function close() {
	console.log('关闭im socket')
})

imWs.on('connection', (ws, req) => {
	// ws.send('server: im socket已连接')
	ws.on('message', function (message) {
		//我们通过响应message事件，在收到消息后再返回一个ECHO: xxx的消息给客户端。
		console.log(`客户端消息:${message}`)
		ws.send(`服务器接收消息:${message}`, err => {
			if (err) {
				console.log(`[SERVER] error:${err}`)
			}
		})
	})
})

module.exports = imWs
