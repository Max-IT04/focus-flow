const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController.mongo");
const auth = require("../middleware/auth");

router.use(auth);

router.get("/", sessionController.getTimeSessions);
router.post("/", sessionController.createTimeSession);
router.delete("/:id", sessionController.deleteTimeSession);

module.exports = router;
