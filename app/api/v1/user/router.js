const express = require("express");
const router = express();
const {
  getAllCMSUser,
  createCMSUser,
  getOneCMSUser,
  updateCMSUser,
  deleteCMSUser,
} = require("./controller");

router.get("/user", getAllCMSUser);
router.post("/user", createCMSUser);
router.get("/user/:id", getOneCMSUser);
router.put("/user/:id", updateCMSUser);
router.delete("/user/:id", deleteCMSUser);

module.exports = router;
