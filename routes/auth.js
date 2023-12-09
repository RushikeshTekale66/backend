const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');


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
            user = await User.create({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email
            })


            res.json(user);
        } catch (error) {
            console.log(error);
            res.status(500).send("Some error occure");
        }

    })

module.exports = router;