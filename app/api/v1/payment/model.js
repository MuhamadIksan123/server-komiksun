const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const PaymentSchema = Schema(
  {
    type: {
      type: String,
      required: [true, "Tipe pembayaran harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    nomor: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    vendor: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Payment", PaymentSchema);
