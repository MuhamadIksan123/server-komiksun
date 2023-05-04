const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let chapterSchema = Schema(
  {
    judul: {
      type: String,
      minlength: [5, "Panjang judul chapter minimal 5 karakter"],
      maxLength: [20, "Panjang judul chapter maksimal 20 karakter"],
      required: [true, "Judul chapter harus diisi"],
    },
    rilis: {
      type: Date,
      required: [true, "Tanggal rilis harus diisi"],
    },
    // untuk membuat relasi pada mongodb kita perlu membuat types ObjectId
    file: {
      type: mongoose.Types.ObjectId,
      ref: "File",
      required: [true, "File harus diupload"],
    },
    komik: {
      type: mongoose.Types.ObjectId,
      ref: "Komik",
      required: true,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Chapter", chapterSchema);
