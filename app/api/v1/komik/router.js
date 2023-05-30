const express = require("express");
const router = express();
const { create, index, find, update, destroy } = require("./controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get("/komik", authenticateUser, authorizeRoles('vendor', 'admin'), index);
router.get("/komik/:id", authenticateUser, authorizeRoles("vendor"), find);
router.post("/komik", authenticateUser, authorizeRoles("vendor"), create);
router.put("/komik/:id", authenticateUser, authorizeRoles("vendor"), update);
router.delete(
  "/komik/:id",
  authenticateUser,
  authorizeRoles("vendor"),
  destroy
);

module.exports = router;
