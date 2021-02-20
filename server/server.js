const http = require('http')
const app = require('./app')
const { port } = require('./configs/index.config')

const server = http.createServer(app)

server.listen(port)