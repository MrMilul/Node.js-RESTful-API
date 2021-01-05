const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user')
const jwt = require("jsonwebtoken")

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

router.post('/login', (req, res, next)=>{
    User.find({email:req.body.email}).exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({message:"Auth Failed 1"})
            
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{

            if(err){
                return res.status(401).json({message:"Auth Failed"})
            }

            if(result){
                console.log(process.env.JWT_KEY)
                const token = jwt.sign({
                    email: user[0].email,
                    id: user[0]._id
                }, 
                process.env.JWT_KEY,
                 {expiresIn:"1hr"}) 
                return res.status(200).json({message:"Auth succeed", token:token})
            }else{
                res.status(401).json({message:"Auth Failed 3"})
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            message: "There are some domistic problem!", 
            error:err
        })
    })
})

module.exports = router