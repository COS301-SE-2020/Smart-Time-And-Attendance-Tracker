const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post("/user/register", user.register);
router.post("/user/login", user.authenticate);

module.exports = router;