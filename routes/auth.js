const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'RushikeshTekale';


//Create user using : Post "/api/auth/createuser " No login require
router.post('/createuser', [
    body('name', 'Enter correct name').isLength({ min: 3 }),
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Password must be greater than 5 character').isLength({ min: 5 })
],
    async (req, res) => {


        // If there are error return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check wether user with same email exist already
        try {
            let user = await User.findOne({ email: req.body.email });

            if (user) {
                return res.status(400).json({ error: "Sorry this email already exist " })
            }

            const salt = await bcrypt.genSalt(10);
            const setPass = await bcrypt.hash(req.body.password, salt);

            //create user
            user = await User.create({
                name: req.body.name,
                password: setPass,
                email: req.body.email
            })

            //Using jwt token for authontication

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({ authToken });


            // res.json(user);

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal server error");
        }

    })

//Authounticate user using : Post "/api/auth/login " No login require
router.post('/login', [
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Password can not be blank').exists()
],
    async (req, res) => {
        // If there are error return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {email, password} = req.body;

        try{
            let user = await User.findOne({email});
            if(!user){
                return res.status(400).json({error:"Please try to login with correct login email"});
            }
            
            const passwordCompare = await bcrypt.compare(password, user.password);
            if(!passwordCompare){
                return res.status(400).json({error:"Please try to login with correct password"});
            }

            const data = {
                user:{
                    id:user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json({authToken});
        }
        catch(error){
            console.error(error.message);
            res.status(500).send("Internal server error");
        }

        res.send("All ok");
    })

module.exports = router;