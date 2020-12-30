const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
   
    res.status(200).json({
        message:"Handling Get request to /products"
    })
})

router.post('/', (req, res, next)=>{
    const prodduct = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message:"Handling Post request to /products",
        createdProduct: prodduct
    })
})

router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId
    if (id === "special"){
        res.status(200).json({
            message:"You descovered special ID", 
            id: id
        })
    }else{
        res.status(200).json({
            message:"you intered an ID", 
            id: id
        })
    }
})


router.patch('/:productId', (req, res, next)=>{
    const id = req.params.productId
    res.status(200).json({
        message:`You Updated a product by this => ${id} id `, 
    })
})



router.delete('/:productId', (req, res, next)=>{
    const id = req.params.productId
    res.status(200).json({
        message:`You Deleted a product by this => ${id} id `, 
    })
})


module.exports = router