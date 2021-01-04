const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user')


router.post('/signup', (req, res, next)=>{
    User.find({ email:req.body.email }).exec().
    then((result)=>{
        if(result.length >= 1){
            console.log(result)
            res.status(409).json({
                message: `${req.body.email} is avalable in db`
            })
        }else{
            bcrypt.hash(req.body.password, 10, (err, hash)=>{
                if (err){
                    res.status(400).json({
                        error: err
                    })
                }else{
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save().then(result=>{
                        res.status(201).json({
                            message: "user created successfully"
                        })
                    }).catch(err=>{
                        res.status(500).json({
                            error:err
                        })
                    })
                }
            })
        }
    })

})



module.exports = router