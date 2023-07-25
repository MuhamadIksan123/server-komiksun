// import model Komik
const Komik = require('../../api/v1/komik/model');
const { checkingImage } = require('./images');
const { checkingGenre } = require('./genre');

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllKomik = async (req) => {
  const { keyword, genre, statusKomik } = req.query;

  let condition = {};

  if (req.user.role !== 'admin') {
    condition = { ...condition, vendor: req.user.userId };
  }

  if (keyword) {
    condition = { ...condition, judul: { $regex: keyword, $options: 'i' } };
  }

  if (genre) {
    condition = { ...condition, genre: genre };
  }

  if (statusKomik) {
    condition = { ...condition, statusKomik: statusKomik };
  }

  const result = await Komik.find(condition)
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .populate({
      path: 'genre',
      select: '_id nama',
    });

  return result;
};

const createKomik = async (req) => {
  const {
    judul,
    penulis,
    sinopsis,
    status,
    price,
    jenis,
    rilis,
    genre,
    image,
  } = req.body;

  // cari image dengan field image
  await checkingGenre(genre);
  await checkingImage(image);

  // cari komik dengan field nama
  const check = await Komik.findOne({ judul });

  // apa bila check true / data komik sudah ada maka kita tampilkan error bad request dengan message komik duplikat
  if (check) throw new BadRequestError('judul komik duplikat');

  const result = await Komik.create({
    judul,
    penulis,
    sinopsis,
    status,
    price,
    jenis,
    rilis,
    genre,
    image,
    vendor: req.user.userId,
  });

  return result;
};

const getOneKomik = async (req) => {
  const { id } = req.params;

  const result = await Komik.findOne({
    _id: id,
  })
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .populate({
      path: 'genre',
      select: '_id nama',
    });

  if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  return result;
};

const updateKomik = async (req) => {
  const { id } = req.params;
  const {
    judul,
    penulis,
    sinopsis,
    status,
    price,
    jenis,
    rilis,
    genre,
    image,
  } = req.body;

  // cari image dengan field image dan genre
  await checkingImage(image);
  await checkingGenre(genre);

  // cari komik dengan field nama dan id selain dari yang dikirim dari params
  const check = await Komik.findOne({
    judul,
    _id: { $ne: id },
    vendor: req.user.userId,
  });

  // apa bila check true / data komik sudah ada maka kita tampilkan error bad request dengan message komik nama duplikat
  if (check) throw new BadRequestError('Judul komik duplikat');

  const result = await Komik.findOneAndUpdate(
    { _id: id },
    { judul, penulis, sinopsis, status, price, jenis, rilis, genre, image },
    { new: true, runValidators: true }
  );

  // jika id result false / null maka akan menampilkan error `Tidak ada komik dengan id` yang dikirim client
  if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  return result;
};

const deleteKomik = async (req) => {
  const { id } = req.params;

  const result = await Komik.findOneAndRemove({
    _id: id,
    vendor: req.user.userId,
  });

  if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  return result;
};

const checkingKomik = async (id) => {
  const result = await Komik.findOne({
    _id: id,
  });

  if (result === undefined || result === null || result === '')
    throw new NotFoundError(`Belum ada komik yang dipilih`);

  if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  return result;
};

const changeStatusKomik = async (req) => {
  const { id } = req.params;
  const { statusKomik } = req.body;

  if (!['Publikasi', 'Tolak Publikasi'].includes(statusKomik)) {
    throw new BadRequestError('Status harus Draft atau Published');
  }

  // cari event berdasarkan field id
  const checkKomik = await Komik.findOne({
    _id: id,
  });

  // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
  if (!checkKomik)
    throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  checkKomik.statusKomik = statusKomik;

  await checkKomik.save();

  return checkKomik;
};

module.exports = {
  getAllKomik,
  createKomik,
  getOneKomik,
  updateKomik,
  deleteKomik,
  checkingKomik,
  changeStatusKomik,
};
