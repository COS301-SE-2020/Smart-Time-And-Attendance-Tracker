const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');
const role = require('../controllers/role.controller');

const jwtHelper = require('../config/jwtHelper');

router.post("/user/register", user.register);
router.post("/user/login", user.authenticate);
router.get("/user/getRoles",jwtHelper.verifyJWTtoken, user.getRoles);

router.get("/role/getRole", jwtHelper.verifyJWTtoken, role.getRole);
router.post("/role/addRole",jwtHelper.verifyJWTtoken, user.isSecurityAdmin, role.add);
module.exports = router;