// import model Komik
const Chapter = require('../../api/v1/chapter/model');
const { checkingFile } = require("./files");
const { checkingKomik } = require("./komik");

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllChapter = async (req) => {
  const { keyword, komik, statusChapter } = req.query;

  let condition = {};

  if (req.user.role !== 'admin') {
    condition = { ...condition, vendor: req.user.userId };
  }

  if (keyword) {
    condition = { ...condition, judul: { $regex: keyword, $options: "i" } };
  }

  if (komik) {
    condition = { ...condition, komik: komik };
  }

  if (statusChapter) {
    condition = { ...condition, statusChapter: statusChapter };
  }

  const result = await Chapter.find(condition)
    .populate({
      path: 'file',
      select: '_id nama',
    })
    .populate({
      path: 'komik',
      select: '_id judul',
    })

  return result;
};

const createChapter = async (req) => {
  const { judul, rilis, file, komik } = req.body;

  // cari image dengan field image
  await checkingKomik(komik);

  // cari komik dengan field nama
  const check = await Chapter.findOne({ judul, vendor: req.user.userId, komik });

  // apa bila check true / data komik sudah ada maka kita tampilkan error bad request dengan message komik duplikat
  if (check) throw new BadRequestError("judul chapter duplikat");

  if(file === '') {
    throw new BadRequestError('Belum ada file komik yang diupload');
  }

  const result = await Chapter.create({
    judul,
    rilis,
    file,
    komik,
    vendor: req.user.userId,
  });

  return result;
};

const getOneChapter = async (req) => {
  const { id } = req.params;

  const result = await Chapter.findOne({
    _id: id, 
    vendor: req.user.userId,
  })
    .populate({
      path: "file",
      select: "_id nama",
    })
    .populate({
      path: "komik",
      select: "_id judul",
    })

  if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  return result;
};

const updateChapter = async (req) => {
  const { id } = req.params;
  const { judul, rilis, file, komik } = req.body;

  // cari image dengan field image dan genre
  await checkingFile(file);
  await checkingKomik(komik);

  // cari komik dengan field nama dan id selain dari yang dikirim dari params
  const check = await Chapter.findOne({
    judul,
    _id: { $ne: id },
    vendor: req.user.userId,
    komik
  });

  // apa bila check true / data komik sudah ada maka kita tampilkan error bad request dengan message komik nama duplikat
  if (check) throw new BadRequestError("Judul chapter duplikat");

  const result = await Chapter.findOneAndUpdate(
    { _id: id },
    { judul, rilis, file, komik },
    { new: true, runValidators: true }
  );

  // jika id result false / null maka akan menampilkan error `Tidak ada komik dengan id` yang dikirim client
  if (!result) throw new NotFoundError(`Tidak ada chapter dengan id :  ${id}`);

  return result;
};

const deleteChapter = async (req) => {
  const { id } = req.params;

  const result = await Chapter.findOneAndRemove({
    _id: id,
    vendor: req.user.userId,
  });

  if (!result) throw new NotFoundError(`Tidak ada chapter dengan id :  ${id}`);

  return result;
};

const checkingChapter = async (id) => {
  const result = await Chapter.findOne({
    _id: id,
  });

  if (!result) throw new NotFoundError(`Tidak ada chapter dengan id :  ${id}`);

  return result;
};

const changeStatusChapter = async (req) => {
  const { id } = req.params;
  const { statusChapter } = req.body;

  if (!['Publikasi', 'Tolak Publikasi'].includes(statusChapter)) {
    throw new BadRequestError('Status harus Draft atau Published');
  }

  // cari event berdasarkan field id
  const checkChapter = await Chapter.findOne({
    _id: id
  });

  // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
  if (!checkChapter)
    throw new NotFoundError(`Tidak ada chapter dengan id :  ${id}`);

  checkChapter.statusChapter = statusChapter;

  await checkChapter.save();

  return checkChapter;
};



module.exports = {
  getAllChapter,
  createChapter,
  getOneChapter,
  updateChapter,
  deleteChapter,
  checkingChapter,
  changeStatusChapter
};
