const express = require('express');
const { updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.put('/settings', updateUser);

module.exports = router;
