const createTokenUser = (user) => {
  return {
    nama: user.nama,
    userId: user._id,
    role: user.role,
    email: user.email,
    lahir: user.lahir,
    image: user.image,
    biodata: user.biodata,
    komik: user.komik,
  };
};

module.exports = { createTokenUser };
