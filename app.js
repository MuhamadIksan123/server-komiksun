var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

// import router genre
const genreRouter = require('./app/api/v1/genre/router');
const imagesRouter = require("./app/api/v1/images/router");

// middlewares
const notFoundMidlleware = require('./app/middlewares/not-found');
const handleErrorMidlleware = require('./app/middlewares/handler-error');

// membuat variabel v1
const v1 = '/api/v1/cms';


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to api semina'
    })
})

// gunakan genre router
app.use(v1, genreRouter);
app.use(v1, imagesRouter);

// middlewares
app.use(notFoundMidlleware);
app.use(handleErrorMidlleware);

module.exports = app;
