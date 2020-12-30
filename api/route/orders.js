const express = require('express');
const router = express.Router();



router.get('/', (req, res, next)=>{
    res.status(200).json({
        message:"Handling Get request to /orders"
    })
})

router.post('/', (req, res, next)=>{
    res.status(201).json({
        message:"Handling Post request to /orders"
    })
})

router.get('/:orderId', (req, res, next)=>{
    const id = req.params.orderId
    res.status(200).json({
        message:"you intered an ID in /orders", 
        id: id
    })
})

router.delete('/:orderId', (req, res, next)=>{
    const id = req.params.orderId
    res.status(200).json({
        message:`You Deleted a product by this => ${id} id `, 
    })
})


module.exports = router