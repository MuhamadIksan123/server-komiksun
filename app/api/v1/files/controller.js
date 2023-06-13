// import services images
const { createFiles, getOneFile } = require('../../../services/mongoose/files');

const { StatusCodes } = require('http-status-codes');

const create = async (req, res) => {
  try {
    const result = await createFiles(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const path = await getOneFile(req);

    res.download(path, (err) => {
      if (err) {
        // Tangani kesalahan jika file tidak ditemukan atau ada masalah lainnya
        console.error(err);
        res.status(404).send('File tidak ditemukan.');
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, find };
