// import services images
const { createFiles, getOneFile } = require('../../../services/mongoose/files');

const { StatusCodes } = require('http-status-codes');

const create = async (req, res, next) => {
  try {
    const result = await createFiles(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const download = async (req, res, next) => {
  try {
    const result = await getOneFile(req);

    // Mengubah base64 menjadi buffer
    const fileBuffer = Buffer.from(result.base64Data, 'base64');

    // Menentukan tipe konten dan nama file untuk respons
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${result.nama}`,
    });

    // Mengirimkan file sebagai respons
    res.send(fileBuffer);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// const find = async (req, res, next) => {
//   try {
//     const path = await getOneFile(req);

//     res.download(path, (err) => {
//       if (err) {
//         // Tangani kesalahan jika file tidak ditemukan atau ada masalah lainnya
//         console.error(err);
//         res.status(404).send('File tidak ditemukan.');
//       }
//     });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = { create, download };
