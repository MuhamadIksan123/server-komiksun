const Transaksi = require('../../api/v1/transaksi/model');

const getAllTransaksi = async (req) => {
  const { limit = 10, page = 1, startDate, endDate } = req.query;
  let condition = {};

  if (req.user.role !== 'admin') {
    condition = { ...condition, 'historyKomik.vendor': req.user.userId };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59);
    condition = {
      ...condition,
      date: {
        $gte: start,
        $lt: end,
      },
    };
  }

  const result = await Transaksi.find(condition)
    .populate({
      path: 'komik',
      populate: { path: 'vendor', select: 'nama' },
    })
    .limit(limit)
    .skip(limit * (page - 1));

  const count = await Transaksi.countDocuments(condition);
  return { data: result, pages: Math.ceil(count / limit), total: count };
};

const getOneTransaksi = async (req) => {
  const { id } = req.params;
  const result = await Transaksi.find({ _id: id })
    .populate({
      path: 'komik',
      populate: { path: 'vendor', select: 'nama' },
    })
    .populate({
      path: 'image',
      select: '_id nama',
    });

    if (!result) throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

    return result;
};

const changeStatusTransaksi = async (req) => {
  const { id } = req.params;
  const { statusTransaksi } = req.body;

  if (!['Berhasil', 'Ditolak'].includes(statusTransaksi)) {
    throw new BadRequestError('Status harus Berhasil atau Ditolak');
  }

  // cari event berdasarkan field id
  const checkTransaksi = await Transaksi.findOne({
    _id: id,
  });

  // jika id result false / null maka akan menampilkan error `Tidak ada acara dengan id` yang dikirim client
  if (!checkTransaksi)
    throw new NotFoundError(`Tidak ada komik dengan id :  ${id}`);

  checkTransaksi.statusTransaksi = statusTransaksi;

  await checkTransaksi.save();

  return checkTransaksi;
};

module.exports = {
  getAllTransaksi,
  getOneTransaksi,
  changeStatusTransaksi,
};
