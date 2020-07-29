/**
  * @file STAT-server/routes/index.router.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all API requests routes.
  * @date 14 June 2020
 */

/**
* Filename:             STAT-server/routes/index.router.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   14 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:         This file handles all API requests routes.
*
*/


const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');
const organisationTeam = require('../controllers/organisationTeam.controller');
const role = require('../controllers/role.controller');
const userTimeEntry = require('../controllers/userTimeEntry.controller');
const team = require('../controllers/team.controller');
const task = require('../controllers/task.controller');
const project = require('../controllers/project.controller');

const jwtHelper = require('../config/jwtHelper');
const userHelper = require('../helpers/user.helper');

//user
router.post("/user/register", user.register);
router.post("/user/login", user.login);
router.get("/user/getRoles",jwtHelper.verifyJWTtoken, user.getRoles);
router.get("/user/getName",jwtHelper.verifyJWTtoken, user.getName);
router.get("/user/isAuthenticated",jwtHelper.verifyJWTtoken, user.isAuthenticated);
router.get("/user/getTasks",jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, user.getTasks);
router.post("/user/changePass",jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, user.changePass);
router.get("/user/getUnauthenticatedUsers",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.getUnauthenticatedUsers);
router.get("/user/getAllUsers",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.getAllUsers);
router.post("/user/authenticateUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.authenticate);
router.post("/user/removeUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.remove);
router.post("/user/editUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.edit);

router.post("/user/addRole",jwtHelper.verifyJWTtoken,user.addRole);
router.post("/user/removeRole",jwtHelper.verifyJWTtoken,user.removeRole);


//role
router.get("/role/getRole", jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, role.getRole);
router.post("/role/addRole",jwtHelper.verifyJWTtoken, userHelper.isSecurityAdmin, role.add);

//userTimeEntry
router.delete("/userTimeEntry/deleteTimeEntry",  jwtHelper.verifyJWTtoken, userHelper.isAuthenticated ,userTimeEntry.deleteTimeEntry);
router.post("/userTimeEntry/addTimeEntry", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.addTimeEntry);
router.post("/userTimeEntry/updateTimeEntry", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.updateTimeEntry);
router.get("/userTimeEntry/getDailyTimeEntries", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.getDailyTimeEntries);


//team
router.post("/team/addTeamMember",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.addTeamMember, user.addTeam);

//router.post("/team/assignProject",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.assignProject);
//router.post("/team/addTeamMember",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.addTeamMember);
router.post("/team/removeTeamMember",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.removeTeamMember, user.removeTeam);


//organisation team    --- ----removed isleader etc for easier testing
router.post("/organisationTeam/createTeam",jwtHelper.verifyJWTtoken,organisationTeam.createTeam);
router.post("/organisationTeam/addTeamMember",jwtHelper.verifyJWTtoken,organisationTeam.addTeamMember);
router.delete("/organisationTeam/remove",jwtHelper.verifyJWTtoken,organisationTeam.remove);
router.post("/organisationTeam/addRole",jwtHelper.verifyJWTtoken,organisationTeam.addRole);


//project
router.post("/project/add", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.add, team.createTeam, team.assignProject);
router.post("/project/addTask",  jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, task.add, project.addTask);
router.post("/project/complete",  jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.complete);
router.delete("/project", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.deleteProject);
router.post("/project/uncomplete",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,project.uncomplete);
router.post("/project/update",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,project.update);

//task
router.post("/task/start",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,task.startTask);
router.post("/task/complete",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,task.completeTask);
router.delete("/task", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader,project.deleteTask, task.deleteTask);
router.post("/task/update",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,task.update);


module.exports = router;