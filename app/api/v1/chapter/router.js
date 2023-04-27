const express = require("express");
const router = express();
const { create, index, find, update, destroy } = require("./controller");

router.get("/chapter", index);
router.get("/chapter/:id", find);
router.post("/chapter", create);
router.put("/chapter/:id", update);
router.delete("/chapter/:id", destroy);

module.exports = router;
