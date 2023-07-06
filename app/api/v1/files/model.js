const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let fileSchema = Schema(
  {
    nama: { type: String },
    base64Data: { type: String },
  },
  { timestamps: true }
);

module.exports = model('File', fileSchema);