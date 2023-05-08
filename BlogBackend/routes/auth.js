const express = require('express');
const { register, login } = require('../controller/usercontroller.js');
const fetchUser = require('../midlewere/fetchuser');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;