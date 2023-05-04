const express = require("express");
const router = express();
const { create, index, find, update, destroy } = require("./controller");

const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get("/payment", authenticateUser, authorizeRoles("vendor"), index);
router.get("/payment/:id", authenticateUser, authorizeRoles("vendor"), find);
router.put("/payment/:id", authenticateUser, authorizeRoles("vendor"), update);
router.delete(
  "/payment/:id",
  authenticateUser,
  authorizeRoles("vendor"),
  destroy
);
router.post("/payment", authenticateUser, authorizeRoles("vendor"), create);

module.exports = router;
