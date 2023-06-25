const User = require('../../api/v1/user/model');
const { BadRequestError } = require('../../errors');

const createUser = async (req, res) => {
  const {
    nama,
    password,
    role,
    confirmPassword,
    email,
    lahir,
    statusUser,
    otp,
    nomor,
    biodata,
    komik,
    image,
  } = req.body;

  if (password !== confirmPassword) {
    throw new BadRequestError('Password dan Konfirmasi password tidak cocok');
  }

  const result = await User.create({
    nama,
    email,
    password,
    role,
    lahir,
    statusUser,
    otp,
    nomor,
    biodata,
    komik,
    image,
  });

  return result;
};

const getAllUser = async (req) => {
  const { keyword, role, statusUser } = req.query;

  let condition = {};

  if (keyword) {
    condition = { ...condition, nama: { $regex: keyword, $options: 'i' } };
  }

  if (role) {
    condition = { ...condition, role: role };
  }

  if (statusUser) {
    condition = { ...condition, statusUser: statusUser };
  }

  const result = await User.find(condition)
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .populate({
      path: 'komik',
      select: [],
    });

  return result;
};

const getOneUser = async (req) => {
  const { id } = req.params;

  const result = await User.findOne({
    _id: id,
  }).populate({
    path: 'image',
    select: '_id nama',
  });

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
    otp,
    nomor,
    biodata,
    image,
    komik,
  } = req.body;

  const check = await User.findOne({
    email,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError('Email user duplikat');

  const result = await User.findOneAndUpdate(
    { _id: id },
    {
      nama,
      password,
      role,
      email,
      lahir,
      otp,
      nomor,
      biodata,
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
  const { statusUser } = req.body;

  if (!['aktif', 'tidak aktif'].includes(statusUser)) {
    throw new BadRequestError('Status user harus aktif atau tidak aktif');
  }

  // cari event berdasarkan field id
  const checkUser = await User.findOne({
    _id: id,
  });

  // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
  if (!checkUser) throw new NotFoundError(`Tidak ada user dengan id :  ${id}`);

  checkUser.statusUser = statusUser;

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
