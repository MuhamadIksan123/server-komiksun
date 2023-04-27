// import services images
const { createFiles } = require("../../../services/mongoose/files");

const { StatusCodes } = require("http-status-codes");

const create = async (req, res) => {
  try {
    const result = await createFiles(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { create };
