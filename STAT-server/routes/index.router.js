const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');
const role = require('../controllers/role.controller');

const jwtHelper = require('../config/jwtHelper');
const userHelper = require('../helpers/user.helper');

router.post("/user/register", user.register);
router.post("/user/login", user.login);
router.get("/user/getRoles",jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, user.getRoles);
//router.get("/user/authenticateUser",jwtHelper.verifyJWTtoken, userHelper.isSecurityAdmin, user.authenticate);

router.get("/role/getRole", jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, role.getRole);
router.post("/role/addRole",jwtHelper.verifyJWTtoken, userHelper.isSecurityAdmin, role.add);
module.exports = router;