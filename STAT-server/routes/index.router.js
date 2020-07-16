const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');
const role = require('../controllers/role.controller');
const userTimeEntry = require('../controllers/userTimeEntry.controller');

const project = require('../controllers/project.controller');
const task = require('../controllers/task.controller');
const team = require('../controllers/team.controller');

const jwtHelper = require('../config/jwtHelper');
const userHelper = require('../helpers/user.helper');

router.post("/user/register", user.register);
router.post("/user/login", user.login);
router.get("/user/getRoles",jwtHelper.verifyJWTtoken, user.getRoles);
router.get("/user/getName",jwtHelper.verifyJWTtoken, user.getName);
router.get("/user/isAuthenticated",jwtHelper.verifyJWTtoken, user.isAuthenticated);
router.get("/user/getTasks",jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, user.getTasks);
//router.get("/user/authenticateUser",jwtHelper.verifyJWTtoken, userHelper.isSecurityAdmin, user.authenticate);

router.get("/role/getRole", jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, role.getRole);
router.post("/role/addRole",jwtHelper.verifyJWTtoken, userHelper.isSecurityAdmin, role.add);


router.delete("/userTimeEntry/deleteTimeEntry",  jwtHelper.verifyJWTtoken, userHelper.isAuthenticated ,userTimeEntry.deleteTimeEntry);

router.post("/userTimeEntry/addTimeEntry", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.addTimeEntry);
router.post("/userTimeEntry/updateTimeEntry", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.updateTimeEntry);
router.get("/userTimeEntry/getDailyTimeEntries", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.getDailyTimeEntries);

router.get("/user/getUnauthenticatedUsers",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.getUnauthenticatedUsers);


//router.post("/team/addTeamMember",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.addTeamMember, user.addTeam);
//router.post("/team/assignProject",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.assignProject);

router.get("/user/getAllUsers",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.getAllUsers);
router.post("/user/authenticateUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.authenticate);
router.post("/user/removeUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.remove);


////projects
router.post("/project/add", jwtHelper.verifyJWTtoken, userHelper.isTeamLead, project.add);
router.post("/project/addTask",  jwtHelper.verifyJWTtoken, userHelper.isTeamLead, task.add, project.addTask);
router.delete("/project/deleteProject",  project.deleteProject);

router.delete("/task/deleteTask",  task.deleteTask);

//router.post("/team/add", jwtHelper.verifyJWTtoken, userHelper.isTeamLead, team.add);

module.exports = router;