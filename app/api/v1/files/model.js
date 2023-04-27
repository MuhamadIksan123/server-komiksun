const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let fileSchema = Schema(
    {
        nama: { type: String }
    },
    { timestamps: true }
);

module.exports = model('File', fileSchema);