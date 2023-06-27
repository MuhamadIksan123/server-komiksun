const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let contactSchema = Schema(
  {
    nama: {
      type: String,
      minlength: [3, 'Panjang nama minimal 3 karakter'],
      maxLength: [20, 'Panjang nama maksimal 20 karakter'],
      required: [true, 'Nama harus diisi'],
    },
    email: {
      type: String,
      minlength: [3, 'Panjang email minimal 3 karakter'],
      maxLength: [30, 'Panjang email maksimal 20 karakter'],
      required: [true, 'Email harus diisi'],
    },
    isiPesan: {
      type: String,
      minlength: [10, 'Panjang isiPesan minimal 10 karakter'],
      maxLength: [500, 'Panjang isiPesan maksimal 500 karakter'],
      required: [true, 'Isi pesan harus diisi'],
    },
    date: {
      type: Date,
      required: [true, 'Date harus diisi'],
    },
  },
  { timestamps: true }
);

module.exports = model('Contact', contactSchema);
