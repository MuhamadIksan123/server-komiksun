// import model Komik
const Komik = require('../../api/v1/komik/model');
const { checkingImage } = require("./images");
const { checkingGenre } = require("./genre");


// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllKomik = async (req) => {
  const { keyword, genre, status } = req.query;

  let condition = { vendor: req.user.userId };

  if (keyword) {
    condition = { ...condition, judul: { $regex: keyword, $options: "i" } };
  }

  if (genre) {
    condition = { ...condition, genre: genre };
  }

  if (["ongoing", "tamat"].includes(status)) {
    condition = { ...condition, status: status };
  }

  const result = await Komik.find(condition)
    .select("_id judul penulis sinopsis status price genre image");

  return result;
};

const createKomik = async (req) => {
  const { judul, penulis, sinopsis, status, price, genre, image } = req.body;

  // cari image dengan field image
  await checkingGenre(genre);
  await checkingImage(image);

  // cari komik dengan field nama
  const check = await Komik.findOne({ judul });

  // apa bila check true / data komik sudah ada maka kita tampilkan error bad request dengan message komik duplikat
  if (check) throw new BadRequestError("judul komik duplikat");

  const result = await Komik.create({
    judul,
    penulis,
    sinopsis,
    status,
    price,
    genre,
    image,
    vendor: req.user.userId
  });

  return result;
};

const getOneKomik = async (req) => {
  const { id } = req.params;

  const result = await Komik.findOne({
    _id: id,
    vendor: req.user.userId,
  })
    .populate({
      path: "image",
      select: "_id nama",
    })
    .populate({
      path: "genre",
      select: "_id nama",
    })
    .select("_id judul penulis sinopsis status price genre image");

  if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  return result;
};

const updateKomik = async (req) => {
  const { id } = req.params;
  const { judul, penulis, sinopsis, status, price, genre, image } = req.body;

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
  if (check) throw new BadRequestError("Judul komik duplikat");

  const result = await Komik.findOneAndUpdate(
    { _id: id },
    { judul, penulis, sinopsis, status, price, genre, image },
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

  if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  return result;
};

module.exports = {
  getAllKomik,
  createKomik,
  getOneKomik,
  updateKomik,
  deleteKomik,
  checkingKomik,
};
