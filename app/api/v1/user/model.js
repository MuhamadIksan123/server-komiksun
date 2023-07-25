const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama harus diisi'],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email harus diisi'],
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      required: [true, 'Role harus diisi'],
    },
    lahir: {
      type: Date,
      default: new Date(),
    },
    statusUser: {
      type: String,
      enum: ['aktif', 'tidak aktif'],
      default: 'tidak aktif',
    },
    otp: {
      type: String,
      required: true,
    },
    nomor: {
      type: String,
      default: '-',
    },
    komik: {
      type: Array,
      default: [],
    },
    biodata: {
      type: String,
      validate: {
        validator: function (value) {
          // Allow empty or undefined values
          if (!value) return true;

          // Check the length of the value
          return value.length >= 30 && value.length <= 400;
        },
        message:
          'Panjang biodata harus minimal 30 karakter dan maksimal 400 karakter',
      },
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: 'Image',
      default: '644a329c733339974c1e1335',
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
