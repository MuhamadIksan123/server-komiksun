const express = require("express");
const router = express();
const { create, index, find, update, destroy, changeStatus } = require("./controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get("/komik", authenticateUser, authorizeRoles('vendor', 'admin'), index);
router.get(
  '/komik/:id',
  authenticateUser,
  authorizeRoles('vendor', 'admin'),
  find
);
router.post("/komik", authenticateUser, authorizeRoles("vendor", 'admin'), create);
router.put("/komik/:id", authenticateUser, authorizeRoles("vendor"), update);
router.delete(
  "/komik/:id",
  authenticateUser,
  authorizeRoles("vendor"),
  destroy
);
router.put(
  '/komik/:id/status',
  authenticateUser,
  authorizeRoles('admin'),
  changeStatus
);

module.exports = router;
