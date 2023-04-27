const express = require('express');
const router = express();
const { create } = require('./controller');
const upload = require('../../../middlewares/multer-file');

router.post('/files', upload.single('berkas'), create);
module.exports = router;