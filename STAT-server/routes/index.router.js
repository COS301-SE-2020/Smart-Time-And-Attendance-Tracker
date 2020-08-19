
/**
  * @file STAT-server/routes/index.router.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all API requests' route.
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
* Description:         This file handles all API requests' route.
*
*/


const express = require('express');
const router = express.Router();

const user = require('../controllers/user.controller');
const role = require('../controllers/role.controller');
const userTimeEntry = require('../controllers/userTimeEntry.controller');
const team = require('../controllers/team.controller');
const task = require('../controllers/task.controller');
const project = require('../controllers/project.controller');
const iotDevice = require("../iotManager/iotDevice.controller");

const jwtHelper = require('../config/jwtHelper');
const userHelper = require('../helpers/user.helper');

//iot devices
router.post("/iotDevice/register", jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin, iotDevice.register);
router.post("/iotDevice/deregister", iotDevice.deregister);
router.post("/iotDevice/getAllDevices", iotDevice.getAllDevices);
router.post("/iotDevice/startTimer", iotDevice.startTimer);
router.post("/iotDevice/stopTimer", iotDevice.stopTimer);

//user
router.post("/user/register", user.register);
router.post("/user/login", user.login);
router.get("/user/getRoles",jwtHelper.verifyJWTtoken, user.getRoles);
router.get("/user/getName",jwtHelper.verifyJWTtoken, user.getName);
router.get("/user/isAuthenticated",jwtHelper.verifyJWTtoken, user.isAuthenticated);
router.get("/user/getProjects",jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, user.getProjects);
router.post("/user/changePass",jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, user.changePass);
router.get("/user/getUnauthenticatedUsers",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.getUnauthenticatedUsers);
router.get("/user/getAllUsers",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.getAllUsers);
router.post("/user/authenticateUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.authenticate);
router.post("/user/removeUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.remove);
router.post("/user/editUser",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin,user.edit);
router.post("/user/addRole",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin, user.addRole);
router.post("/user/removeRole",jwtHelper.verifyJWTtoken,userHelper.isSecurityAdmin, user.removeRole);


//role
router.get("/role/getRole", jwtHelper.verifyJWTtoken, userHelper.isAuthenticated, role.getRole);
router.post("/role/addRole",jwtHelper.verifyJWTtoken, userHelper.isSecurityAdmin, role.add);

//userTimeEntry
router.delete("/userTimeEntry/deleteTimeEntry",  jwtHelper.verifyJWTtoken, userHelper.isAuthenticated ,userTimeEntry.deleteTimeEntry);
router.post("/userTimeEntry/addTimeEntry", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.addTimeEntry);
router.post("/userTimeEntry/updateTimeEntry", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.updateTimeEntry);
router.get("/userTimeEntry/getDailyTimeEntries", jwtHelper.verifyJWTtoken,userHelper.isAuthenticated, userTimeEntry.getDailyTimeEntries);


// team  
router.post("/team/add",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.createTeam);
router.post("/team/addTeamMember",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader,team.addTeamMember);
router.post("/team/removeTeamMember",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader, team.removeTeamMember);
router.post("/team/changeRole",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader, team.addRole);
router.post("/team/editTeam",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader, team.editTeam);
router.delete("/team", jwtHelper.verifyJWTtoken,userHelper.isTeamLeader, team.deleteTeam);
router.get("/team/getTeams",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader, team.getTeams);

//project
router.post("/project/add", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.add, user.addProject);
router.post("/project/addMember", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.addMember, user.addProject);
router.post("/project/removeMember", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.removeMember, user.removeProject);
router.post("/project/changeRole",jwtHelper.verifyJWTtoken,userHelper.isTeamLeader, project.addRole);
router.post("/project/addTeam", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.addTeam);
router.post("/project/clearMembers", jwtHelper.verifyJWTtoken, userHelper.isTeamLeader, project.removeTeam);
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