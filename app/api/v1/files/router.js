const express = require('express');
const router = express();
const { create, find } = require('./controller');
const upload = require('../../../middlewares/multer-file');

router.post('/files', upload.single('berkas'), create);
// router.post('/files', (req, res) => {
//   console.log(req?.file);
//   console.log(req?.file?.filename);
//   return res.status(200);
// });
router.get('/files/:id', find);
module.exports = router;
