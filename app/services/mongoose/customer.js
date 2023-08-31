const User = require('../../api/v1/user/model');
const Komik = require('../../api/v1/komik/model');
const Genre = require('../../api/v1/genre/model');
const Transaksi = require('../../api/v1/transaksi/model');
const Payment = require('../../api/v1/payment/model');
const Chapter = require('../../api/v1/chapter/model');
const Contact = require('../../api/v1/contact/model');
const Rating = require('../../api/v1/rating/model');

const midtransClient = require('midtrans-client');
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: 'SB-Mid-server-8HFDCO6xYb1335jY1TGbrvH_',
  clientKey: 'SB-Mid-client-z9XIaQxpas1Y0Qfg',
});

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../../errors');
const { createTokenUser, createJWT, createRefreshJWT } = require('../../utils');
const { createUserRefreshToken } = require('./refreshToken');

const { otpMail } = require('../mail');

const signupUser = async (req) => {
  const { nama, email, password, role, image } = req.body;

  // jika email dan status tidak aktif
  let result = await User.findOne({
    email,
    statusUser: 'tidak aktif',
  });

  if (result) {
    result.nama = nama;
    result.role = role;
    result.email = email;
    result.password = password;
    result.image = image;
    result.otp = Math.floor(Math.random() * 9999);
    await result.save();
  } else {
    result = await User.create({
      nama,
      email,
      password,
      role,
      image,
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

  if (!check) throw new NotFoundError('User belum terdaftar');

  if (otp === undefined || otp === null || otp === '')
    throw new NotFoundError('Kode otp harus diisi');

  if (check && check.otp !== otp) throw new BadRequestError('Kode otp salah');

  const result = await User.findByIdAndUpdate(
    check._id,
    {
      statusUser: 'aktif',
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

  const result = await User.findOne({ email: email }).populate({
    path: 'image',
    select: '_id nama',
  });
  if (!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  if (result.statusUser === 'tidak aktif') {
    throw new UnauthorizedError('Akun anda belum aktif');
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  const token = createJWT({ payload: createTokenUser(result) });
  const refreshToken = createRefreshJWT({ payload: createTokenUser(result) });
  await createUserRefreshToken({
    refreshToken,
    user: result._id,
  });

  return {
    token,
    dataUser: result,
    refreshToken,
    role: result.role,
    email: result.email,
  };
};

const getAllGenre = async () => {
  const result = await Genre.find();
  return result;
};

// const getAllKomik = async (req) => {
//   const result = await Komik.find({ statusKomik: 'Publikasi' })
//     .populate({
//       path: 'image',
//       select: '_id nama',
//     })
//     .populate({
//       path: 'genre',
//       select: '_id nama',
//     })
//     .populate({
//       path: 'vendor',
//       select: '_id nama role email lahir statusUser otp nomor image komik',
//     });

//   return result;
// };

const getAllKomik = async () => {
  try {
    const komiks = await Komik.find({ statusKomik: 'Publikasi' })
      .populate({
        path: 'image',
        select: '_id nama',
      })
      .populate({
        path: 'genre',
        select: '_id nama',
      })
      .populate({
        path: 'vendor',
        select: '_id nama role email lahir statusUser otp nomor image komik',
      });

    // Ambil semua ID komik dari data komik yang ditemukan
    const komikIds = komiks.map((komik) => komik._id);

    // Cari semua rating yang memiliki ID komik yang sesuai
    const ratings = await Rating.find({ komik: { $in: komikIds } });

    // Buat objek untuk menyimpan rating berdasarkan ID komik
    const ratingsByKomikId = {};
    ratings.forEach((rating) => {
      if (!ratingsByKomikId[rating.komik]) {
        ratingsByKomikId[rating.komik] = [];
      }
      ratingsByKomikId[rating.komik].push(rating.rating);
    });

    // Gabungkan rating ke dalam data komik
    const komiksWithRating = komiks.map((komik) => {
      const komikId = komik._id.toString();
      const komikRatings = ratingsByKomikId[komikId] || [];
      const averageRating =
        komikRatings.length > 0
          ? komikRatings.reduce((acc, rating) => acc + rating, 0) /
            komikRatings.length
          : 0;

      // Ubah averageRating menjadi angka dengan 1 digit desimal
      const roundedRating = averageRating.toFixed(1);

      return {
        ...komik.toObject(),
        ratings: komikRatings,
        averageRating: roundedRating,
      };
    });

    return komiksWithRating;
  } catch (error) {
    throw new Error('Gagal mendapatkan data komik beserta rating');
  }
};

const getOneKomik = async (req) => {
  const { id } = req.params;

  try {
    const komik = await Komik.findOne({ _id: id })
      .populate('genre')
      .populate({ path: 'vendor', populate: 'image' })
      .populate('image');

    if (!komik) {
      throw new NotFoundError(`Tidak ada komik dengan id : ${id}`);
    }

    const ratings = await Rating.find({ komik: id }).select('rating customer');
    const komikRatings = ratings.map((rating) => rating.rating);

    const totalRatings = komikRatings.length;
    const sumRatings = komikRatings.reduce((acc, rating) => acc + rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Tambahkan field averageRating ke objek komik
    komik.averageRating = averageRating;

    return {
      ...komik.toObject(),
      averageRating: averageRating,
    };

    // return komik;
  } catch (error) {
    throw new Error(
      `Gagal mendapatkan data komik dengan rating: ${error.message}`
    );
  }
};

const getAllVendor = async (req) => {
  const result = await User.find({ role: 'vendor', statusUser: 'aktif' })
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

const getOneVendor = async (req) => {
  const { id } = req.params;
  const result = await User.findOne({ _id: id })
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .populate({
      path: 'komik',
      select: [],
    });

  if (!result) throw new NotFoundError(`Tidak ada vendor dengan id :  ${id}`);

  return result;
};

const getAllChapter = async (req) => {
  const result = await Chapter.find({ statusChapter: 'Publikasi' })
    .populate({
      path: 'file',
      select: '_id nama',
    })
    .populate({
      path: 'komik',
      select: '_id judul',
    });

  return result;
};

const getOneChapter = async (req) => {
  const { id } = req.params;
  const result = await Chapter.findOne({ _id: id })
    .populate({
      path: 'file',
      select: '_id nama base64Data',
    })
    .populate({
      path: 'komik',
      select: '_id judul',
    });

  if (!result) throw new NotFoundError(`Tidak ada vendor dengan id :  ${id}`);

  return result;
};

const getAllTransaksi = async (req) => {
  const result = await Transaksi.find({ customer: req.user.userId }).populate({
    path: 'komik',
    populate: { path: 'image', select: 'nama' },
  });
  return result;
};

/**
 * Tugas Send email invoice
 * TODO: Ambil data email dari personal detail
 *  */
// const checkoutOrder = async (req) => {
//   const { komik, personalDetail, payment, image } = req.body;

//   if (!payment) {
//     throw new BadRequestError('Mohon isi data metode pembayaran');
//   }

//   if (!image) {
//     throw new BadRequestError('Mohon isi data gambar');
//   }

//   if (
//     !personalDetail ||
//     !personalDetail.lastName ||
//     !personalDetail.firstName ||
//     !personalDetail.email ||
//     !personalDetail.role
//   ) {
//     throw new BadRequestError(
//       'Mohon isi data lengkap personal detail (lastName, firstName, email, role)'
//     );
//   }

//   const checkingKomik = await Komik.findOne({ _id: komik });
//   if (!checkingKomik) {
//     throw new NotFoundError('Tidak ada komik dengan id : ' + komik);
//   }

//   const checkingPayment = await Payment.findOne({ _id: payment });

//   if (!checkingPayment) {
//     throw new NotFoundError(
//       'Tidak ada metode pembayaran dengan id :' + payment
//     );
//   }

//   const checkingOrder = await Transaksi.findOne({
//     komik,
//     customer: req.user.userId,
//   });

//   if (checkingOrder) {
//     if (checkingOrder.komik.toString() === komik) {
//       if (checkingOrder.statusTransaksi === 'Menunggu Konfirmasi') {
//         throw new BadRequestError(
//           'Sudah order, mohon tunggu admin mengkonfirmasi pembayaran'
//         );
//       }
//     }
//   }

//   await checkingKomik.save();

//   const historyKomik = {
//     judul: checkingKomik.judul,
//     penulis: checkingKomik.penulis,
//     sinopsis: checkingKomik.sinopsis,
//     status: checkingKomik.status,
//     price: checkingKomik.price,
//     jenis: checkingKomik.jenis,
//     rilis: checkingKomik.rilis,
//     statusKomik: checkingKomik.statusKomik,
//     genre: checkingKomik.genre,
//     image: checkingKomik.image,
//     vendor: checkingKomik.vendor,
//   };

//   const result = new Transaksi({
//     date: new Date(),
//     personalDetail: personalDetail,
//     price: checkingKomik.price,
//     customer: req.user.userId,
//     komik,
//     historyKomik,
//     payment,
//     statusTransaksi: 'Menunggu Konfirmasi',
//     image,
//   });

//   await result.save();
//   return result;
// };

const checkoutOrder = async (req) => {
  const { komik, personalDetail } = req.body;

  const checkingKomik = await Komik.findOne({ _id: komik });
  if (!checkingKomik) {
    throw new NotFoundError('Tidak ada data komik dengan id : ' + komik);
  }

  await checkingKomik.save();

  if (
    !personalDetail ||
    !personalDetail.lastName ||
    !personalDetail.firstName ||
    !personalDetail.email ||
    !personalDetail.role
  ) {
    throw new BadRequestError(
      'Mohon isi data lengkap personal detail (lastName, firstName, email, role)'
    );
  }

  try {
    const chargeResponse = await coreApi.charge(req.body);

    const dataTransaksi = await Transaksi.find({
      komik: komik,
      customer: req.user.userId,
    });

    const foundSettlementTransaction = dataTransaksi.find(
      (transaksi) =>
        transaksi.response_midtrans.transaction_status === 'settlement'
    );

    if (foundSettlementTransaction) {
      throw new BadRequestError('Sudah melakukan pembayaran sebelumnya');
    }

    const foundPendingTransaction = dataTransaksi.find(
      (transaksi) =>
        transaksi.response_midtrans.transaction_status === 'pending'
    );

    if (foundPendingTransaction) {
      throw new BadRequestError(
        'Transaksi dalam status menunggu. Harap selesaikan transaksi.'
      );
    }

    const historyKomik = {
      judul: checkingKomik.judul,
      penulis: checkingKomik.penulis,
      sinopsis: checkingKomik.sinopsis,
      status: checkingKomik.status,
      price: checkingKomik.price,
      jenis: checkingKomik.jenis,
      rilis: checkingKomik.rilis,
      statusKomik: checkingKomik.statusKomik,
      genre: checkingKomik.genre,
      image: checkingKomik.image,
      vendor: checkingKomik.vendor,
    };

    const dataOrder = {
      date: new Date(),
      personalDetail: personalDetail,
      customer: req.user.userId,
      komik: komik,
      historyKomik: historyKomik, // Menyimpan data historyKomik
      response_midtrans: chargeResponse,
      order_id: chargeResponse.order_id,
    };

    const result = await Transaksi.create(dataOrder);

    console.log(result);

    return result;
  } catch (error) {
    throw error; // Anda sebaiknya menangani atau mencatat error dengan tepat
  }
};


const getTransaksibyStatus = async (req) => {
  try {
    const statusResponse = await coreApi.transaction.status(
      req.params.order_id
    );
    // Lakukan sesuatu dengan objek `response`
    let responseMidtrans = statusResponse;

    await Transaksi.updateOne(
      { order_id: req.params.order_id },
      { response_midtrans: responseMidtrans }
    );

    const dataTransaksi = await Transaksi.findOne({
      order_id: req.params.order_id,
    });

    const result = await User.findOne({ _id: dataTransaksi.customer });

    const komikValue = dataTransaksi.komik
      ? dataTransaksi.komik.toString()
      : '';

    // Ambil objek komik dari basis data berdasarkan komikValue
    const komik = await Komik.findOne({ _id: komikValue });

    if (!komik) {
      throw new Error('Data komik tidak ditemukan.');
    }

    // Ambil judul komik dari objek komik
    const judulKomik = komik.judul; // Ganti dengan properti yang sesuai

    if (komikValue && komikValue !== '' && result.komik) {
      const foundKomik = result.komik.some(
        (komik) => komik.value && komik.value.toString() === komikValue
      );

      if (responseMidtrans.transaction_status === 'settlement') {
        if (!foundKomik) {
          let komikToAdd = {
            value: dataTransaksi.komik._id,
            label: judulKomik, // Ganti dengan label yang sesuai
            target: {
              value: dataTransaksi.komik._id,
              name: 'komik',
            }, // Ganti dengan target yang sesuai
          };

          const foundExistingKomik = result.komik.some(
            (komik) => komik.value === komikToAdd.value
          );

          if (!foundExistingKomik) {
            result.komik.push(komikToAdd);

            await User.updateOne(
              { _id: dataTransaksi.customer },
              { komik: result.komik }
            );
          }
        }
      }
    }
    return statusResponse;
  } catch (error) {
    // Tangani kesalahan jika ada
    throw error; // Anda juga bisa melakukan penanganan kesalahan khusus di sini
  }
};

// const getTransaksibyStatus = async (req) => {
//   coreApi.transaction.status(req.params.order_id).then((response) => {
//     // do something to `response` object
//     let responseMidtrans = statusResponse;

//     const result = Transaksi.update(
//       { response_midtrans: responseMidtrans },
//       { where: { id: req.params.order_id } }
//     )
//   });

//   return result
// };

const getAllPaymentByVendor = async (req) => {
  const { vendor } = req.params;

  const result = await Payment.find({ vendor: vendor }).populate({
    path: 'image',
    select: '_id nama',
  });

  return result;
};

const getAllCustomer = async (req) => {
  const result = await User.find({ role: 'customer' })
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

const getOneCustomer = async (req) => {
  const { id } = req.params;
  const result = await User.findOne({ _id: id, role: 'customer' })
    .populate({
      path: 'image',
      select: '_id nama',
    })
    .populate({
      path: 'komik',
      select: [],
    });

  if (!result) throw new NotFoundError(`Tidak ada vendor dengan id :  ${id}`);

  return result;
};

const createContact = async (req) => {
  const { nama, email, isiPesan, date } = req.body;

  const result = await Contact.create({ nama, email, isiPesan, date });

  return result;
};

const addRating = async (req, res) => {
  const { id } = req.params;
  const { rating, customer } = req.body;

  const komik = await Komik.findOne({
    _id: id,
  });

  if (!komik) throw new NotFoundError(`Tidak ada komik`);

  // Create the rating
  const newRating = new Rating({
    rating,
    customer,
    komik: komik._id,
  });

  await newRating.save();

  // Update the average rating for the komik
  const ratings = await Rating.find({ komik: komik._id });
  const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalRatings / ratings.length;

  komik.rating = averageRating;
  await komik.save();

  return komik;
};

const getAllRating = async (req) => {
  const result = await Rating.find();

  return result;
};

const getAllKomikByHighestRating = async () => {
  try {
    // Memanggil fungsi untuk mendapatkan semua komik dengan rating
    const komiksWithRating = await getAllKomik();

    // Mengurutkan komik berdasarkan averageRating dari tertinggi ke terendah
    const komiksWithHighestRating = komiksWithRating.sort(
      (a, b) => b.averageRating - a.averageRating
    );

    return komiksWithHighestRating;
  } catch (error) {
    throw new Error('Gagal mendapatkan data komik beserta rating');
  }
};

const getAllKomikByGenreAction = async () => {
  const genreId = '64478156eafc6ebfbe383b37';
  // Memanggil fungsi untuk mendapatkan semua komik dengan rating
  const komiksWithRating = await getAllKomikByHighestRating();

  // Mengambil hanya komik dengan genre "Action" berdasarkan ID genre
  const komiksWithGenreAction = komiksWithRating.filter(
    (komik) => komik.genre._id.toString() === genreId
  );

  return komiksWithGenreAction;
};

const getAllKomikByGenreAdventure = async () => {
  const genreId = '64491e5bdf65809939892196';
  // Memanggil fungsi untuk mendapatkan semua komik dengan rating
  const komiksWithRating = await getAllKomikByHighestRating();

  // Mengambil hanya komik dengan genre "Adventure" berdasarkan ID genre
  const komiksWithGenreAdventure = komiksWithRating.filter(
    (komik) => komik.genre._id.toString() === genreId
  );

  return komiksWithGenreAdventure;
};

const getAllKomikByGenreSchool = async () => {
  const genreId = '644782f17ae963db3a36acef';
  // Memanggil fungsi untuk mendapatkan semua komik dengan rating
  const komiksWithRating = await getAllKomikByHighestRating();

  // Mengambil hanya komik dengan genre "Adventure" berdasarkan ID genre
  const komiksWithGenreSchool = komiksWithRating.filter(
    (komik) => komik.genre._id.toString() === genreId
  );

  return komiksWithGenreSchool;
};

module.exports = {
  signupUser,
  activateUser,
  signinUser,
  getAllGenre,
  getAllKomik,
  getOneKomik,
  getAllTransaksi,
  checkoutOrder,
  getTransaksibyStatus,
  getAllPaymentByVendor,
  getAllVendor,
  getOneVendor,
  getAllChapter,
  getOneChapter,
  getAllCustomer,
  getOneCustomer,
  createContact,
  addRating,
  getAllRating,
  getAllKomikByHighestRating,
  getAllKomikByGenreAction,
  getAllKomikByGenreAdventure,
  getAllKomikByGenreSchool,
};
