/**
  * @file STAT-server/models/db.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles the database connection.
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/models/db.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles the database connection.
*
*/ 

const mongoose = require('mongoose');
require("../config/config.js");
mongoose.set('useNewUrlParser', true);

console.log("check if mongouri exists---------------- "+process.env.MONGODB_URI+" JWT= "+process.env.JWT_SECRET)


mongoose.connect(decodeURIComponent(process.env.MONGODB_URI), (err) => {
    if (!err) { console.log('MongoDB connection succeeded.'); }
    else { console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)); }
});

const Organisation = require("./organisation.model")
const Project = require("./project.model")
const User = require("./user.model")
const Task = require("./task.model")
const Team = require("./team.model")
const Role = require("./role.model")
const TimeEntry = require("./timeEntry.model");
const UserTimeEntry = require("./userTimeEntry.model");
const IOTDevice = require("./iotDevice.model");
const Calendar = require("./calendarEvents.model");
