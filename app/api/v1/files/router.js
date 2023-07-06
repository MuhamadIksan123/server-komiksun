const express = require('express');
const router = express();
const { create, download } = require('./controller');
const upload = require('../../../middlewares/multer-pdf');

// router.post('/files', create);

// Route untuk mengupload file
router.post('/files', upload.single('berkas'), create);
// router.get('/files/:id', find);

// Endpoint untuk mengunduh file berdasarkan ID
router.get('/files/:id', download);

module.exports = router;
