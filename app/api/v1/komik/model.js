const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let komikSchema = Schema(
  {
    judul: {
      type: String,
      minlength: [3, "Panjang judul komik minimal 3 karakter"],
      maxLength: [20, "Panjang judul komik maksimal 20 karakter"],
      required: [true, "Judul komik harus diisi"],
    },
    penulis: {
      type: String,
      minlength: [3, "Panjang nama penulis minimal 3 karakter"],
      maxLength: [20, "Panjang nama penulis maksimal 20 karakter"],
      required: [true, "Penulis komik harus diisi"],
    },
    sinopsis: {
      type: String,
      minlength: [30, "Panjang sinopsis minimal 30 karakter"],
      maxLength: [100, "Panjang sinopsis maksimal 100 karakter"],
      required: [true, "Nama harus diisi"],
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    price: {
      type: Number,
      default: 0,
    },
    // untuk membuat relasi pada mongodb kita perlu membuat types ObjectId
    genre: {
      type: mongoose.Types.ObjectId,
      ref: "Genre",
      required: true,
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    // vendor: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
  },
  { timestamps: true }
);

module.exports = model("Komik", komikSchema);
