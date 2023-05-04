const express = require("express");
const router = express();
const {
  getAllCMSUser,
  createCMSUser,
  getOneCMSUser,
  updateCMSUser,
  deleteCMSUser,
} = require("./controller");

const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

router.get("/user", authenticateUser, authorizeRoles("admin"), getAllCMSUser);
router.post("/user", authenticateUser, authorizeRoles("admin"), createCMSUser);
router.get(
  "/user/:id",
  authenticateUser,
  authorizeRoles("admin"),
  getOneCMSUser
);
router.put(
  "/user/:id",
  authenticateUser,
  authorizeRoles("admin"),
  updateCMSUser
);
router.delete(
  "/user/:id",
  authenticateUser,
  authorizeRoles("admin"),
  deleteCMSUser
);

module.exports = router;
