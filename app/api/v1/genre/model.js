const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let genreSchema = Schema(
  {
    nama: {
      type: String,
      minlength: [3, "Panjang nama genre minimal 3 karakter"],
      maxLength: [20, "Panjang nama genre maksimal 20 karakter"],
      required: [true, "Nama genre harus diisi"],
    },
  },
  { timestamps: true }
);

module.exports = model("Genre", genreSchema);
