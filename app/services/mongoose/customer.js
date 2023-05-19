const User = require("../../api/v1/user/model");
const Komik = require("../../api/v1/komik/model");
const Transaksi = require("../../api/v1/transaksi/model");
const Payment = require("../../api/v1/payment/model");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../../errors");
const { createTokenUser, createJWT } = require("../../utils");

const { otpMail } = require("../mail");

const signupUser = async (req) => {
  const { nama, email, password, role } = req.body;

  // jika email dan status tidak aktif
  let result = await User.findOne({
    email,
    status: "tidak aktif",
  });

  if (result) {
    result.nama = nama;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = Math.floor(Math.random() * 9999);
    await result.save();
  } else {
    result = await User.create({
      nama,
      email,
      password,
      role,
      otp: Math.floor(Math.random() * 9999),
    });
  }
  await otpMail(email, result);

  delete result._doc.password;
  delete result._doc.otp;

  return result;
};

const activateUser = async (req) => {
  const { otp, email } = req.body;
  const check = await User.findOne({
    email,
  });

  if (!check) throw new NotFoundError("User belum terdaftar");

  if (check && check.otp !== otp) throw new BadRequestError("Kode otp salah");

  const result = await User.findByIdAndUpdate(
    check._id,
    {
      status: "aktif",
    },
    { new: true }
  );

  delete result._doc.password;

  return result;
};

const signinUser = async (req) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const result = await User.findOne({ email: email });

  if (!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  if (result.status === 'tidak aktif') {
    throw new UnauthorizedError('Akun anda belum aktif');
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const token = createJWT({ payload: createTokenUser(result) });

  return token;
};

const getAllKomik = async (req) => {
  const result = await Komik.find({ status: "Ongoing" })
    .select("_id judul penulis sinopsis status price genre image");

  return result;
};

const getOneKomik = async (req) => {
  const { id } = req.params;
  const result = await Komik.findOne({ _id: id })
    .populate('genre')
    .populate({ path: 'vendor', populate: 'profile' })
    .populate('image');

  if (!result) throw new NotFoundError(`Tidak ada acara dengan id :  ${id}`);

  return result;
};

const getAllTransaksi = async (req) => {
  const result = await Transaksi.find({ customer: req.user.userId });
  return result;
};

/**
 * Tugas Send email invoice
 * TODO: Ambil data email dari personal detail
 *  */
const checkoutOrder = async (req) => {
  const { komik, personalDetail, payment } = req.body;

  const checkingKomik = await Komik.findOne({ _id: komik });
  if (!checkingKomik) {
    throw new NotFoundError('Tidak ada komik dengan id : ' + komik);
  }

  const checkingPayment = await Payment.findOne({ _id: payment });

  if (!checkingPayment) {
    throw new NotFoundError(
      'Tidak ada metode pembayaran dengan id :' + payment
    );
  }

  await checkingKomik.save();

  const historyKomik = {
    judul: checkingKomik.judul,
    penulis: checkingKomik.penulis,
    sinopsis: checkingKomik.sinopsis,
    status: checkingKomik.status,
    price: checkingKomik.price,
    genre: checkingKomik.genre,
    image: checkingKomik.image,
    vendor: checkingKomik.vendor,
  };

  const result = new Transaksi({
    date: new Date(),
    personalDetail: personalDetail,
    price: checkingKomik.price,
    customer: req.user.userId,
    komik,
    historyKomik,
    payment,
  });

  await result.save();
  return result;
};

const getAllPaymentByVendor = async (req) => {
  const { vendor } = req.params;

  const result = await Payment.find({ vendor: vendor });

  return result;
};

module.exports = {
  signupUser,
  activateUser,
  signinUser,
  getAllKomik,
  getOneKomik,
  getAllTransaksi,
  checkoutOrder,
  getAllPaymentByVendor
};