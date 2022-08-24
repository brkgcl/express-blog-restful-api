const express = require('express');
const rooter = express.Router();

//encrype
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//model
const userModel = require('../model/userModel');

// !!!!!!     index rootunu karşıla burada   !!!!!!!


//---------------------- MİDDLE-WARE ROOTER -----------------------------
rooter.post('/register', (req ,res, next) => {
    const {userName, name, surname, email, password} = req.body;
    const verifyUser = userModel.findOne({ email: email });
    if (!verifyUser)
        res.status(409).send("User Already Exits. Please login");
    
    bcrypt.hash(password, 10).then((hashPassword) => {
        const user = new userModel ({
            userName,
            name,
            surname,
            email,
            password: hashPassword,
        });

        const promise = user.save();
        promise.then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json(err);
        })
    });
});

rooter.post('/login', (req, res, next) => { 
    // const userName = req.params.userName;
    // const password = req.body.password;
    const { userName, password } = req.body;

    userModel.findOne({ 
        userName 
    }, (err, user) => {
        if (err)
            throw err;

        if(!user){
            res.json({
                status: false,
                message: "Authentication failed, user not found.",
            })
        }else {
            bcrypt.compare(password, user.password)
                .then((result) => {
                    if(!result){
                        res.json({
                            status: false,
                            message: 'Authentication failed, wrong password'
                        });
                    }else {
                        const payload = {
                            userName
                        };
                        const token = jwt.sign(payload, req.app.get('api_secret_key'), {
                            expiresIn: 720 //12 saat
                        });
                        res.json({
                            status: true,
                            token
                        });
                    }
                })
        }
    });
})

module.exports = rooter;