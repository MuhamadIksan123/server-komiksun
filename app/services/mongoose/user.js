const User = require("../../api/v1/user/model");
const { BadRequestError } = require("../../errors");

const createUser = async (req, res) => {
  const {
    nama,
    password,
    role,
    confirmPassword,
    email,
    lahir,
    status,
    otp,
    nomor,
    komik,
    image
  } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError("Password dan Konfirmasi password tidak cocok");
  }

  
  const result = await User.create({
    nama,
    email,
    password,
    role,
    lahir,
    status,
    otp,
    nomor,
    komik,
    image
  });

  return result;
};

const getAllUser = async (req) => {
  const result = await User.find()
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .populate({
      path: 'komik',
      select: []
    })

  return result;
};

const getOneUser = async (req) => {
  const { id } = req.params;

  const result = await User.findOne({
    _id: id,
  })
    .populate({
      path: "image",
      select: "_id nama",
    })
    .select(
      "_id nama password role email lahir status otp nomor image komik"
    );

  if (!result)
    throw new NotFoundError(`Tidak ada data user dengan id :  ${id}`);

  return result;
};

const updateUser = async (req) => {
  const { id } = req.params;
  const {
    nama,
    password,
    role,
    email,
    lahir,
    status,
    otp,
    nomor,
    image,
    komik,
  } = req.body;

  const check = await User.findOne({
    email,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("Email user duplikat");

  const result = await User.findOneAndUpdate(
    { _id: id },
    {
      nama,
      password,
      role,
      email,
      lahir,
      status,
      otp,
      nomor,
      image,
      komik,
    },
    { new: true, runValidators: true }
  );

  if (!result) throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

  return result;
};

const deleteUser = async (req) => {
  const { id } = req.params;
  const result = await User.findOneAndDelete({ _id: id });

  if (!result) throw new NotFoundError(`Tidak ada user dengan id : ${id}`);

  return result;
};

const changeStatusUser = async (req) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['aktif', 'tidak aktif'].includes(status)) {
    throw new BadRequestError('Status user harus aktif atau tidak aktif');
  }

  // cari event berdasarkan field id
  const checkUser = await User.findOne({
    _id: id,
  });

  // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
  if (!checkUser)
    throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

  checkUser.status = status;

  await checkUser.save();

  return checkUser;
};

module.exports = {
  createUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
  changeStatusUser,
};
