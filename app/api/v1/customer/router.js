const express = require("express");
const router = express();
const {
  signup,
  activeUser,
  signin,
  getAllLandingPage,
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
} = require('./controller');

const { authenticateUser } = require("../../../middlewares/auth");

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.put("/active", activeUser);
router.get("/komik", getAllLandingPage);
router.get("/komik/:id", getDetailLandingPage);
router.get("/transaksi", authenticateUser, getDashboard);
router.post("/checkout", authenticateUser, checkout);
router.get("/payment/:vendor", authenticateUser, getAllPayment);
router.get('/genre', getAllListGenre);
router.get('/vendor', getAllWriter);
router.get('/vendor/:id', getDetailWriter);
router.get('/chapter', getAllLandingChapter);
router.get('/chapter/:id', getDetailChapter);
router.get('/customer', getAllReader);
router.get('/customer/:id', getDetailReader);
router.post('/contact', createContactCustomer);
router.post('/komik/:id/rating', createRating);
router.get('/rating', ratingAll);
router.get('/komik-highest-rating', allComicsByHighestRating);
router.get('/komik-genre-action', allComicsByGenreAction);
router.get('/komik-genre-adventure', allComicsByGenreAdventure);



module.exports = router;
