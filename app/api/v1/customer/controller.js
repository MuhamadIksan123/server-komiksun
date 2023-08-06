const {
  signupUser,
  activateUser,
  signinUser,
  getAllGenre,
  getAllKomik,
  getOneKomik,
  getAllTransaksi,
  checkoutOrder,
  getAllPaymentByVendor,
  getAllVendor,
  getOneVendor,
  getAllChapter,
  getOneChapter,
  getAllCustomer,
  getOneCustomer,
  createContact,
  addRating,
  getAllRating,
  getAllKomikByHighestRating,
  getAllKomikByGenreAction,
  getAllKomikByGenreAdventure
} = require('../../../services/mongoose/customer');

const { StatusCodes } = require("http-status-codes");

const signup = async (req, res, next) => {
  try {
    const result = await signupUser(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const activeUser = async (req, res, next) => {
  try {
    const result = await activateUser(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const result = await signinUser(req);

    res.status(StatusCodes.OK).json({
      data: {
        token: result.token,
        dataUser: result.dataUser,
        refreshToken: result.refreshToken,
        role: result.role,
        email: result.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAllListGenre = async (req, res, next) => {
  try {
    const result = await getAllGenre(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllLandingPage = async (req, res, next) => {
  try {
    const result = await getAllKomik(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getDetailLandingPage = async (req, res, next) => {
  try {
    const result = await getOneKomik(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getDashboard = async (req, res, next) => {
  try {
    const result = await getAllTransaksi(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const checkout = async (req, res, next) => {
  try {
    const result = await checkoutOrder(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllPayment = async (req, res, next) => {
  try {
    const result = await getAllPaymentByVendor(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllWriter = async (req, res, next) => {
  try {
    const result = await getAllVendor(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getDetailWriter = async (req, res, next) => {
  try {
    const result = await getOneVendor(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllLandingChapter = async (req, res, next) => {
  try {
    const result = await getAllChapter(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getDetailChapter = async (req, res, next) => {
  try {
    const result = await getOneChapter(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllReader = async (req, res, next) => {
  try {
    const result = await getAllCustomer(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getDetailReader = async (req, res, next) => {
  try {
    const result = await getOneCustomer(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createContactCustomer = async (req, res, next) => {
  try {
    const result = await createContact(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createRating = async (req, res, next) => {
  try {
    const result = await addRating(req);

    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const ratingAll = async (req, res, next) => {
  try {
    const result = await getAllRating(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const allComicsByHighestRating = async (req, res, next) => {
  try {
    const result = await getAllKomikByHighestRating(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const allComicsByGenreAction = async (req, res, next) => {
  try {
    const result = await getAllKomikByGenreAction(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const allComicsByGenreAdventure = async (req, res, next) => {
  try {
    const result = await getAllKomikByGenreAdventure(req);

    res.status(StatusCodes.OK).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  activeUser,
  signin,
  getAllLandingPage,
  getOneKomik,
  getDetailLandingPage,
  getDashboard,
  checkout,
  getAllPayment,
  getAllListGenre,
  getAllWriter,
  getDetailWriter,
  getAllLandingChapter,
  getDetailChapter,
  getAllReader,
  getDetailReader,
  createContactCustomer,
  createRating,
  ratingAll,
  allComicsByHighestRating,
  allComicsByGenreAction,
  allComicsByGenreAdventure,
};
