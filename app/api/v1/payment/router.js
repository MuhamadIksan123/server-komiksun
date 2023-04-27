const express = require("express");
const router = express();
const { create, index, find, update, destroy } = require("./controller");

router.get("/payment", index);
router.get("/payment/:id", find);
router.put("/payment/:id", update);
router.delete("/payment/:id", destroy);
router.post("/payment", create);

module.exports = router;
