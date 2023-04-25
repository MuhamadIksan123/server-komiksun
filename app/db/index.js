// import package mongoose
const mongoose = require('mongoose');

// kita import konfigurasi terkait mongoDb dari app/config.js
const {urlDb} = require('../config');

// connect ke mongoDb menggunakan konfigurasi yang telah kita import mongoose.connect(urlDb);
mongoose.connect(urlDb);

// simpan kondek dalam constant db
const db = mongoose.connection;

// export db supaya bisa digunakan oleh file lain yang membutuhkan
module.exports = db;