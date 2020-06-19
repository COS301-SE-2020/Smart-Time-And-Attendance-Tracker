const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

//router.post("/api/register", user.register);
router.post("/api/login", user.authenticate);

module.exports = router;