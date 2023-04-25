// import router dari express
const express = require('express');
const router = express();

// import product controller
const { create, index, find, update, destroy } = require('./controller');

// pasangkan router endpoint dengan method 'create'
router.post('/genre', create);
router.get("/genre", index);
router.get("/genre/:id", find);
router.put("/genre/:id", update);
router.delete("/genre/:id", destroy);

// export router
module.exports = router;
