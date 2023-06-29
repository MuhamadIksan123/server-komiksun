const express = require("express");
const router = express();
const { index, find, changeStatus } = require("./controller");
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

router.get(
  '/transaksi/:id',
  authenticateUser,
  authorizeRoles('vendor', 'admin'),
  find
);

router.put(
  '/transaksi/:id/status',
  authenticateUser,
  authorizeRoles('admin'),
  changeStatus
);

module.exports = router;
