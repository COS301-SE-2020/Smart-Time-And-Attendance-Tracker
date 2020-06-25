const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');
const role = require('../controllers/role.controller');

const jwtHelper = require('../config/jwtHelper');

router.post("/user/register", user.register);
router.post("/user/login", user.authenticate);
router.post("/user/getRoles",jwtHelper.verifyJWTtoken, user.getRoles);

router.post("/role/getRole", role.getRole);
router.post("/role/add", role.add);
module.exports = router;