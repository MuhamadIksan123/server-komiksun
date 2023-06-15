const express = require("express");
const router = express();
const { create, index, find, update, destroy, changeStatus } = require("./controller");

const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get("/chapter", authenticateUser, authorizeRoles("vendor"), index);
router.get("/chapter/:id", authenticateUser, authorizeRoles("vendor"), find);
router.post("/chapter", authenticateUser, authorizeRoles("vendor"), create);
router.put("/chapter/:id", authenticateUser, authorizeRoles("vendor"), update);
router.delete(
  "/chapter/:id",
  authenticateUser,
  authorizeRoles("vendor"),
  destroy
);
router.put(
  '/chapter/:id/status',
  authenticateUser,
  authorizeRoles('admin'),
  changeStatus
);

module.exports = router;
