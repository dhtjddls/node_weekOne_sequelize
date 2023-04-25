const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const authcontroller = new AuthController();

router.post("/signup", authcontroller.signup);
router.post("/login", authcontroller.login);

module.exports = router;
