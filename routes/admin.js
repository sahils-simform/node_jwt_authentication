const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

router.post("/login", adminController.addloginDetails);

router.get("/posts", adminController.authenticateToken);

router.post("/token", adminController.generateNewToken);

router.delete("/logout", adminController.removeAccessToken);

module.exports = router;
