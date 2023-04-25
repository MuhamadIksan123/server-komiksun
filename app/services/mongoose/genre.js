// import model genre
const Genre = require("../../api/v1/genre/model");

// import custom error not found dan bad request
const { NotFoundError, BadRequestError } = require("../../errors");

const getAllGenre = async () => {
  const result = await Genre.find();
  return result;
};

const createGenre = async (req) => {
  const { nama } = req.body;
  // cari genre dengan field genre
  const check = await Genre.findOne({ nama });

  // apabila check true / data genre sudah ada maka kita tampilkan error bad request dengan message nama genre duplikat
  if (check) throw new BadRequestError("nama genre duplikat");

  const result = await Genre.create({ nama });

  return result;
};

const getOneGenre = async (req) => {
  const { id } = req.params;
  const result = await Genre.findOne({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada genre dengan id : ${id}`);

  return result;
};

const updateGenre = async (req) => {
  const { id } = req.params;
  const { nama } = req.body;

  const check = await Genre.findOne({
    nama,
    _id: { $ne: id },
  });
  
  if (check) throw new BadRequestError("Nama genre duplikat");

  const result = await Genre.findOneAndUpdate(
    { _id: id },
    { nama },
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundError(`Tidak ada genre dengan id :  ${id}`);

  return result
};

const deleteGenre = async (req) => {
  const { id } = req.params;
  const result = await Genre.findOneAndDelete({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada genre dengan id : ${id}`);

  return result;
};

module.exports = {
    getAllGenre,
    createGenre,
    getOneGenre,
    updateGenre,
    deleteGenre
}