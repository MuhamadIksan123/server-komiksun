// import model Komik
const Chapter = require('../../api/v1/chapter/model');
const { checkingFile } = require("./files");
const { checkingKomik } = require("./komik");

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllChapter = async (req) => {
  const { keyword, komik } = req.query;

  let condition = { vendor: req.user.userId };

  if (keyword) {
    condition = { ...condition, judul: { $regex: keyword, $options: "i" } };
  }

  if (komik) {
    condition = { ...condition, komik: komik };
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
    .select('_id judul rilis file komik');

  return result;
};

const createChapter = async (req) => {
  const { judul, rilis, file, komik } = req.body;

  // cari image dengan field image
  await checkingFile(file);
  await checkingKomik(komik);

  // cari komik dengan field nama
  const check = await Chapter.findOne({ judul, vendor: req.user.userId });

  // apa bila check true / data komik sudah ada maka kita tampilkan error bad request dengan message komik duplikat
  if (check) throw new BadRequestError("judul komik duplikat");

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
    .select("_id judul rilis file komik");

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

module.exports = {
  getAllChapter,
  createChapter,
  getOneChapter,
  updateChapter,
  deleteChapter,
  checkingChapter,
};
