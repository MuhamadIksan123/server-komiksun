const mongoose = require('mongoose');

const transaksiSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    statusTransaksi: {
      type: String,
      enum: ['Menunggu Konfirmasi', 'Berhasil', 'Ditolak'],
      default: 'Menunggu Konfirmasi',
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      required: [true, 'Bukti pembayaran harus diupload'],
    },
    personalDetail: {
      firstName: {
        type: String,
        required: [true, 'Please provide firstName'],
        minlength: 3,
        maxlength: 50,
      },
      lastName: {
        type: String,
        required: [true, 'Please provide lastName'],
        minlength: 3,
        maxlength: 50,
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
      },
      role: {
        type: String,
        default: 'Designer',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    price: {
      type: Number,
      default: 0,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    payment: {
      type: mongoose.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    komik: {
      type: mongoose.Types.ObjectId,
      ref: 'Komik',
      required: true,
    },
    historyKomik: {
      judul: {
        type: String,
        minlength: 5,
        maxLength: 20,
        required: [true, 'Judul komik harus diisi'],
      },
      penulis: {
        type: String,
        minlength: 5,
        maxLength: 30,
        required: [true, 'Penulis komik harus diisi'],
      },
      sinopsis: {
        type: String,
        minlength: 30,
        maxLength: 400,
        required: [true, 'Nama harus diisi'],
      },
      status: {
        type: String,
        enum: ['Ongoing', 'Tamat'],
        required: [true, 'Status harus diisi'],
      },
      price: {
        type: Number,
        default: 0,
      },
      jenis: {
        type: String,
        enum: ['Manga', 'Manhwa', 'Manhua', 'Webtoon', 'Komik Indo'],
        required: [true, 'Jenis komik harus diisi'],
      },
      rilis: {
        type: Date,
        required: [true, 'Tanggal rilis harus diisi'],
      },
      statusKomik: {
        type: String,
        enum: ['Menunggu Konfirmasi', 'Publikasi', 'Tolak Publikasi'],
        default: 'Menunggu Konfirmasi',
      },
      // untuk membuat relasi pada mongodb kita perlu membuat types ObjectId
      genre: {
        type: mongoose.Types.ObjectId,
        ref: 'Genre',
        required: true,
      },
      image: {
        type: mongoose.Types.ObjectId,
        ref: 'Image',
        required: true,
      },
      vendor: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaksi', transaksiSchema);
