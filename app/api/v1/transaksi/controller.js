const { getAllTransaksi, getOneTransaksi, changeStatusTransaksi } = require("../../../services/mongoose/transaksi");

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

const find = async (req, res, next) => {
  try {
    const result = await getOneTransaksi(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const result = await changeStatusTransaksi(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
  find,
  changeStatus
};
