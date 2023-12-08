const express = require('express');
const router = express.Router();
const User = require("../models/User");
const {body, validationResult}=require('express-validator');


//Create user using : Post "/api/auth/" dosen't require auth
router.post('/',[
    body('name', 'Enter correct name').isLength({min:3}),
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Password must be greater than 5 character').isLength({min:5})
],
(req, res)=>{
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    User.create({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email 
    }).then(user=>res.json(user)).catch(err=>{console.log(err)
    res.json({error:"Please enter unique email"})})
    
})

module.exports = router;