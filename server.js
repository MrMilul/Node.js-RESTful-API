const http = require('http')
const port = process.env.PORT || 3000
const app = require('./app')

const server = http.createServer(app)
server.listen(port, ()=>{
    console.log("Port 3000 is reserved for the node and now is connected")
})

