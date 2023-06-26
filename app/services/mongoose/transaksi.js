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
module.exports = {
  getAllTransaksi,
};
