const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.mongo");
const auth = require("../middleware/auth");

router.use(auth);

router.put("/settings", userController.updateSettings);

module.exports = router;
