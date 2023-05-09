const { getAllTransaksi } = require("../../../services/mongoose/transaksi");

const { StatusCodes } = require("http-status-codes");

const index = async (req, res, next) => {
  try {
    const result = await getAllTransaksi(req);

    res.status(StatusCodes.OK).json({
      data: { transaksi: result.data, pages: result.pages, total: result.total },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
};
