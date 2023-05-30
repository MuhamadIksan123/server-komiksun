const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')


const app = express();

// import router genre
const genreRouter = require('./app/api/v1/genre/router');
const imagesRouter = require("./app/api/v1/images/router");
const komikRouter = require("./app/api/v1/komik/router");
const filesRouter = require("./app/api/v1/files/router");
const chapterRouter = require("./app/api/v1/chapter/router");
const paymentRouter = require("./app/api/v1/payment/router");
const userRouter = require("./app/api/v1/user/router");
const authRouter = require("./app/api/v1/auth/router");
const customerRouter = require("./app/api/v1/customer/router");



// middlewares
const notFoundMidlleware = require('./app/middlewares/not-found');
const handleErrorMidlleware = require('./app/middlewares/handler-error');

// membuat variabel v1
const v1 = '/api/v1';

app.use(cors());
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
app.use(`${v1}/cms`, genreRouter);
app.use(`${v1}/cms`, imagesRouter);
app.use(`${v1}/cms`, komikRouter);
app.use(`${v1}/cms`, filesRouter);
app.use(`${v1}/cms`, chapterRouter);
app.use(`${v1}/cms`, paymentRouter);
app.use(`${v1}/cms`, userRouter);
app.use(`${v1}/cms`, authRouter);
app.use(v1, customerRouter);


// middlewares
app.use(notFoundMidlleware);
app.use(handleErrorMidlleware);

module.exports = app;
