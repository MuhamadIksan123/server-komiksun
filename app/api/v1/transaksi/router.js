const express = require("express");
const router = express();
const { index } = require("./controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get(
  "/transaksi",
  authenticateUser,
  authorizeRoles("customer", "vendor", "admin"),
  index
);

module.exports = router;
