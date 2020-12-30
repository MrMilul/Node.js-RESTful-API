const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product')



router.get('/', (req, res, next)=>{
   Product.find().exec().then(docs =>{
       if(docs.length > 0){
        res.status(200).json(docs)
       }else{
           res.status(500).json({
               message: "No data in DB"
           })
       }

   })
   .catch(err=>{
       res.status(500).json({
           error:err
       })
   })
})

router.post('/', (req, res, next)=>{
    const product = new Product({
        _id : mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    })
    product.save().
    then(result=>{
        console.log(result)
        res.status(201).json({
            message:"Handling Post request to /products",
            createdProduct: product
        })
    }).
    catch(err=>{console.log(err)})
    
})

router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId
    Product.findById(id).exec()
    .then(doc =>{ 
        console.log(doc)
        if (doc){
            res.status(200).json(doc)
        }else{
            res.status(404).json({message:"No valid entry founded for provided data!"})
        }
    })
    .catch((err)=>{
        res.status(500).json({
            error: err
        })
    })
})


router.patch('/:productId', (req, res, next)=>{
    const id = req.params.productId
    res.status(200).json({
        message:`You Updated a product by this => ${id} id `, 
    })
})



router.delete('/:productId', (req, res, next)=>{
    const id = req.params.productId
    Product.remove({_id:id})
    .exec().then(result=>{
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router