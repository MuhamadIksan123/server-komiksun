// import model category
const {
  createUser,
  getAllUser,
  getOneUser,
  updateUser,
  deleteUser,
  changeStatusUser
} = require("../../../services/mongoose/user");
const { StatusCodes } = require("http-status-codes");

const getAllCMSUser = async (req, res, next) => {
  try {
    const result = await getAllUser(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createCMSUser = async (req, res, next) => {
  try {
    const result = await createUser(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getOneCMSUser = async (req, res, next) => {
  try {
    const result = await getOneUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateCMSUser = async (req, res, next) => {
  try {
    const result = await updateUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCMSUser = async (req, res, next) => {
  try {
    const result = await deleteUser(req);
    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const result = await changeStatusUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Export fungsi create pada controller categories
module.exports = {
  createCMSUser,
  getAllCMSUser,
  getOneCMSUser,
  updateCMSUser,
  deleteCMSUser,
  changeStatus
};
