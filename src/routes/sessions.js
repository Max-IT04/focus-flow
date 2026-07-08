const express = require('express');
const { getSessions, createSession, deleteSession } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getSessions);
router.post('/', createSession);
router.delete('/:id', deleteSession);

module.exports = router;
