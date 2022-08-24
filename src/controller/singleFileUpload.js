// const express = require('express');
// const router = express.Router();
const multer = require('multer');
// const fs = require('fs');
const { v4: uuidv4 } = require('uuid');



const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/img');
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = uuidv4().toString();
        callback(null, uniqueSuffix + '_' + file.originalname);
    }
})

const fileFilter = (req, file, callback) => {
    if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
        callback(null, true);
    }
}

const upload = multer({ storage: diskStorage, fileFilter: fileFilter }).single("file")
module.exports = upload

// //post metodu
// const singleFileUpload = (req, res) => {



// }







