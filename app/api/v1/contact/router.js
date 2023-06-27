// import router dari express
const express = require('express');
const router = express();

// import product controller
const { create, index, find, destroy } = require('./controller');

const {
  authenticateUser,
  authorizeRoles,
} = require('../../../middlewares/auth');

// pasangkan router endpoint dengan method 'create'
router.post('/contact', authenticateUser, authorizeRoles('admin'), create);
router.get(
  '/contact',
  authenticateUser,
  authorizeRoles('admin'),
  index
);
router.get('/contact/:id', authenticateUser, authorizeRoles('admin'), find);
router.delete('/contact/:id', authenticateUser, authorizeRoles('admin'), destroy);

// export router
module.exports = router;
