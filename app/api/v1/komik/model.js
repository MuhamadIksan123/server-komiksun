const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let komikSchema = Schema(
  {
    judul: {
      type: String,
      minlength: [5, 'Panjang judul komik minimal 5 karakter'],
      maxLength: [20, 'Panjang judul komik maksimal 20 karakter'],
      required: [true, 'Judul komik harus diisi'],
    },
    penulis: {
      type: String,
      minlength: [5, 'Panjang nama penulis minimal 5 karakter'],
      maxLength: [20, 'Panjang nama penulis maksimal 20 karakter'],
      required: [true, 'Penulis komik harus diisi'],
    },
    sinopsis: {
      type: String,
      minlength: [30, 'Panjang sinopsis minimal 30 karakter'],
      maxLength: [400, 'Panjang sinopsis maksimal 400 karakter'],
      required: [true, 'Sinopsis komik harus diisi'],
    },
    status: {
      type: String,
      enum: ['Ongoing', 'Tamat'],
      required: [true, 'Status komik harus diisi'],
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
      required: [true, 'Genre harus dipilih'],
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      required: [true, 'Image harus diupload'],
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Komik", komikSchema);
