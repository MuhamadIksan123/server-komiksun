// import router dari express
const express = require('express');
const router = express();

// import product controller
const { create, index, find, update, destroy } = require('./controller');

const {
  authenticateUser,
  authorizeRoles,
} = require("../../../middlewares/auth");

// pasangkan router endpoint dengan method 'create'
router.post("/genre", authenticateUser, authorizeRoles("admin"), create);
router.get("/genre", authenticateUser, authorizeRoles("admin"), index);
router.get("/genre/:id", authenticateUser, authorizeRoles("admin"), find);
router.put("/genre/:id", authenticateUser, authorizeRoles("admin"), update);
router.delete("/genre/:id", authenticateUser, authorizeRoles("admin"), destroy);

// export router
module.exports = router;
