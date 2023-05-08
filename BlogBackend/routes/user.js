const express = require('express');
const { personaluser, getsearch } = require('../controller/userpercontroller.js');
const fetchUser = require('../midlewere/fetchuser');
const router = express.Router();

router.get("/personaluser", fetchUser, personaluser);

router.get("/getsearch/:id", fetchUser, getsearch);


module.exports = router;