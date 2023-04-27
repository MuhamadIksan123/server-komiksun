const {
  getAllChapter,
  getOneChapter,
  updateChapter,
  createChapter,
  deleteChapter,
} = require("../../../services/mongoose/chapter");

const { StatusCodes } = require("http-status-codes");

const create = async (req, res, next) => {
  try {
    const result = await createChapter(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllChapter(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const result = await getOneChapter(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const result = await updateChapter(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteChapter(req);

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
  update,
  destroy,
  create,
};
