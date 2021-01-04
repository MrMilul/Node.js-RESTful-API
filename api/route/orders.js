const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('../models/order')

router.get('/', (req, res, next)=>{
    Order.find().populate('product', 'name').exec().then((result)=>{
        const ress = {
            count: result.length,
            orders: result.map(ords=>{
                return{
                    id: ords._id,
                    quantity: ords.quantity,
                    product: ords.product,
                    request:{
                        type: "GET",
                        url:  "http://localhost:3000/orders/" +ords._id
                    }
                }
            })
        }
        res.status(200).json(ress)
    })
    .catch((err)=>{
        res.status(500).json({
            error: err, 
            message: "We catching the errors"
        })
    })
})

router.post('/', (req, res, next)=>{
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })

    order.save().then((result)=>{
        const ress = {
            id: result._id,
            quantity: result.quantity,
            product: result.product,
        }
        res.status(201).json(ress)
    })
    .catch((err)=>{
       res.status(500).json({
           error:err
       })
    })
})

router.get('/:orderId', (req, res, next)=>{
    const id = req.params.orderId

   Order.findById(id).populate('product').exec().then((result)=>{
       if(!result){
           return res.status(404).json({
               message: "Requested query Not Found"
           })
       }
       const ress = {
           id: result._id,
           quantity: result.quantity,
           product: result.product
       }
       res.status(200).json(ress)
   })
   .catch((err)=>{
       res.status(500).json({
           error:err, 
           message: "We catching the errors"

       })
   })
})

router.delete('/:orderId', (req, res, next)=>{
    const id = req.params.orderId
   Order.remove({_id:id}).exec().then(resulr=>{
       res.status(200).json({
           message: "Requested object is successfuly deleted"
       })
   })
   .catch(err=>{
       res.status(500).json({
           error:err
       })
   })
})

module.exports = router