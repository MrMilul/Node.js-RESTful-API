const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer')

const Product = require('../models/product')


const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads/')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }

})
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png'){
       cb(null, true)
    }else{
        cb(new Error('jpg format not accepted'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})






router.get('/', (req, res, next)=>{
   Product.find().select('name price _id productImage').exec()
   .then(docs =>{
       const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request:{
                        type: "GET",
                        url: `http://localhost:3000/products/${doc._id}`
                    }
                }

            })        
       }
      res.status(200).json(response)
    })
   .catch(err=>{
       res.status(500).json({
           error:err
       })
   })
})

router.post('/', upload.single('productImage'),(req, res, next)=>{
    console.log(req.file)
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price, 
        productImage: req.file.path
    })
    product.save().
    then(result=>{
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
    const updateOps = {}
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Product.update({_id:id}, {$set: updateOps}).exec()
    .then(result=>{
        res.status(200).json(result)    
    })
    .catch((err)=>{
        res.status(500).json({
            error: err
        })
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