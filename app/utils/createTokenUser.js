const createTokenUser = (user) => {
  return {
    nama: user.nama,
    userId: user._id,
    role: user.role,
    email: user.email,
    lahir: user.lahir,
    sampul: user.sampul,
    profile: user.profile,
    komik: user.komik,
  };
};

module.exports = { createTokenUser };
