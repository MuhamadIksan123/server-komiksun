const Images = require('../../api/v1/images/model');

const createImages = async (req) => {
    const result = await Images.create({
        nama: req.file
        ? `uploads/${req.file.filename}`
        : 'uploads/avatar/default.jpeg'
    });

    return result;
};

// tambahkan function checking Image 
const checkingImage = async (id) => {
  const result = await Images.findOne({ _id: id });
    if (result === undefined || result === null || result === '')
      throw new NotFoundError(`Sampul komik belum diupload`);  
  if (!result) throw new NotFoundError(`Tidak ada Gambar dengan id :  ${id}`);

  return result;
};

module.exports = { createImages, checkingImage };