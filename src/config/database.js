const mongoose = require('mongoose');
const url = process.env.DATABASE_SECRET_KEY; 

const database = mongoose.connect(url)
    .then(() => {
        console.log("connect database");
    })
    .catch((err) => {
        console.log("connect error: " + err);
    })

module.exports = database;