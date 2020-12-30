const express = require("express")
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const productRoutes = require('./api/route/products')
const orderRoutes = require ('./api/route/orders')


//using morgan as a logger 
app.use(morgan('dev'))

//parse pur body buy bady-parser (both urlencoded and json data)
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//setting up Database using MongoDB Atlas
// please replace <password>, and <dbname> by given data from the Atlas
mongoose.connect("mongodb+srv://mrmilul:milad123456@cluster0.fy4sm.mongodb.net/node-rest?retryWrites=true&w=majority",
{ useNewUrlParser: true, useUnifiedTopology: true })

//logger! Just make sure the db is connected
mongoose.connection.once("open", ()=>{console.log("DB connected")})

//handling the headers and CORS
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT', 'GET', 'POST', 'PATCH', 'DELETE')
        return res.status(200).json({})
    }
    next()
})



//importing APIs
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)


//handling the 404 errors  
app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
})






module.exports = app