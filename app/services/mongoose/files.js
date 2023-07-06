const Files = require('../../api/v1/files/model');
const fs = require('fs');

const createFiles = async (req, res) => {
  const file = req.file;

  // Memeriksa apakah file ada
  if (!file) {
    return res.status(400).send('File tidak ditemukan.');
  }

  // Mengubah file ke base64
  const base64Data = file.buffer.toString('base64');

  const result = await Files.create({ nama: file.originalname, base64Data });

  return result;
};

const getOneFile = async (req, res) => {
  const fileId = req.params.id;

  // Cari file di database berdasarkan ID
  const result = await Files.findById(fileId);

  if (!result) {
    return res.status(404).send('File tidak ditemukan.');
  }

  return result;
};

// const getOneFile = async (req, res) => {
//   const { id } = req.params;
//   const result = await Files.findOne({ _id: id });

//   if (!result) throw new NotFoundError(`Tidak ada file dengan id : ${id}`);

//   const path = `public/${result.nama}`;

//   return path;
// };

// tambahkan function checking File
const checkingFile = async (id) => {
  const result = await Files.findOne({ _id: id });

  if (!result) throw new NotFoundError(`File dengan id ${id} belum terupload, harap tunggu sebentar`);

  return result;
};

module.exports = { createFiles, checkingFile, getOneFile };
