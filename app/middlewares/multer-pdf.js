const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    //reject file
    cb(
      {
        message: 'Unsupported file format',
      },
      false
    );
  }
};

const uploadMiddleware = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter: fileFilter,
});

module.exports = uploadMiddleware;
