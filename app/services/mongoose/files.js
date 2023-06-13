const Files = require('../../api/v1/files/model');

const createFiles = async (req) => {
  const result = await Files.create({
    nama: req.file
      ? `uploads/${req.file.filename}`
      : 'uploads/berkas/default.pdf',
  });

  return result;
};

const getOneFile = async (req, res) => {
  const { id } = req.params;
  const result = await Files.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada file dengan id : ${id}`);

  const path = `public/${result.nama}`;

  return path;
};

// tambahkan function checking File
const checkingFile = async (id) => {
  const result = await Files.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada File dengan id :  ${id}`);

  return result;
};

module.exports = { createFiles, checkingFile, getOneFile };
