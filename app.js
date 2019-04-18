const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const productRouter = require('./api/routes/Product');
const orderRouter = require('./api/routes/Orders');
const userRouter = require('./api/routes/user');


// const mdb = 'mongodb://127.0.0.1:27017/Stores'
// mongoose.connect(mdb, {
//     useNewUrlParser: true,
//     useCreateIndex: true
// }, (error) => {
//     if (!error) {
//         console.log("Mongo Connected SuccessFully");
//     } else {
//         console.log("Error occured" + error);
//     }
// });
// mongoose.Promise = global.Promise;

const app = express();

app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/user', userRouter);
app.get('*', function(req, res) {
res.sendFile(path.join(__dirname + '/public/index.html'));
});
module.exports = app;
