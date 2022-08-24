const express = require('express');
const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3000; // env PORT u tekrar kontrol et

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//config
const config = require('./config');
app.set('api_secret_key', config.api_secret_key);

//middleware
const verifyToken = require('./src/middleware/verify-token');

//env
require('dotenv').config({path:'./src/config/.env'});

// database
require('./src/config/database');

// rooter
const userRooter = require('./src/rooter/userRooter')
const postRooter = require('./src/rooter/postRooter')

app.get('/', (req, res) => {
    res.send("hello world!");
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const indexRooter = require('./src/rooter/index')
// middleware 
app.use('/', indexRooter);
app.use('/api', verifyToken);

// api  
app.use('/api/user', userRooter );
app.use('/api/post', postRooter );

//singleFile
const fileRouter = require('./src/rooter/fileRooter');
app.use('/api/file', fileRouter);


app.listen(PORT, () => {
    console.log("listen on port " + PORT);
});

// try {
//     const result = JSON.parse(undefined);
//   } catch (err) {
//     // 👇️ This runs
//     console.log('Error: ', err.message);
//   }

// app.use((req, res, next) => {
//     next(createError(404));
// });

module.exports = app;