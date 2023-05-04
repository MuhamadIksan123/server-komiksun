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
    sampul,
    profile,
    komik,
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
    sampul,
    profile,
    komik,
  });

  console.log(role);

  return result;
};

const getAllUser = async (req) => {
  const result = await User.find();

  return result;
};

const getOneUser = async (req) => {
  const { id } = req.params;

  const result = await User.findOne({
    _id: id,
  })
    .populate({
      path: "sampul",
      select: "_id nama",
    })
    .populate({
      path: "profile",
      select: "_id nama",
    })
    .select(
      "_id nama password role email lahir status otp sampul profile komik"
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
    confirmPassword,
    email,
    lahir,
    status,
    otp,
    sampul,
    profile,
    komik,
  } = req.body;

  const check = await User.findOne({
    nama,
    _id: { $ne: id },
  });

  if (check) throw new BadRequestError("Nama user duplikat");

  const result = await User.findOneAndUpdate(
    { _id: id },
    {
      nama,
      password,
      role,
      confirmPassword,
      email,
      lahir,
      status,
      otp,
      sampul,
      profile,
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

module.exports = { createUser, getAllUser, getOneUser, updateUser, deleteUser };
