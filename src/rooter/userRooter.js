const { Router } = require('express');
const express = require('express');
const rooter = express.Router();

const userController = require('../controller/userController')

// model
const userModel = require('../model/userModel')

//-------------- ROOTER -------------------

//allUsers
rooter.get('/', userController.allUsers)
//singleUser
rooter.get('/:userName', userController.singleUser)
//addUser
rooter.post('/', userController.addUser);
//updateUser
rooter.put('/:userId', userController.updateUser);
//deleteUser
rooter.delete('/:userId', userController.deleteUser);


module.exports = rooter;