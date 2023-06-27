// import services contact
const {
  getAllContact,
  getOneContact,
  createContact,
  deleteContact,
} = require('../../../services/mongoose/contact');

const { StatusCodes } = require('http-status-codes');

// buat function create
const create = async (req, res, next) => {
  try {
    const result = await createContact(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllContact(req);
    res.status(StatusCodes.OK).json({
      data: {
        contact: result.data,
        pages: result.pages,
        total: result.total,
      },
    });
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const result = await getOneContact(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteContact(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  index,
  find,
  destroy,
};
