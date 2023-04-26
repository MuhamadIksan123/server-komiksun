const express = require("express");
const router = express();
const { create, index, find, update, destroy } = require("./controller");

router.get("/komik", index);
router.get("/komik/:id", find);
router.post("/komik", create);
router.put("/komik/:id", update);
router.delete("/komik/:id", destroy);

module.exports = router;
