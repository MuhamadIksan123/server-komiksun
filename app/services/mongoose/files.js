const Files = require('../../api/v1/files/model');

const createFiles = async (req) => {
    const result = await Files.create({
        nama: req.file
        ? `uploads/${req.file.filename}`
        : 'uploads/avatar/default.pdf'
    });

    return result;
};

// tambahkan function checking File 
const checkingFile = async (id) => {
  const result = await Files.findOne({ _id: id });
  
  if (!result) throw new NotFoundError(`Tidak ada File dengan id :  ${id}`);

  return result;
};

module.exports = { createFiles, checkingFile };