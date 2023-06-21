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
  getAllReader
} = require("./controller");

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




module.exports = router;
