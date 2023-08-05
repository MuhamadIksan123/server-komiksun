const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let ratingSchema = Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    komik: {
      type: mongoose.Types.ObjectId,
      ref: 'Komik',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model('Rating', ratingSchema);
