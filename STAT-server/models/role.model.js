/**
  * @file STAT-server/models/role.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the Role model in our database
  * @date 11June 2020
 */

/**
* Filename:             STAT-server/models/role.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the Role model in our database
*
*/ 

const mongoose = require("mongoose")

var RoleSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
    Role:{
        type: String,
        required : "Required",
        unique: true
    }
});

mongoose.model("Role", RoleSchema);