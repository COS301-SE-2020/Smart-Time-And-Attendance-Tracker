/**
  * @file STAT-server/models/attendanceEntry.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file contains the TimeEntry model in our database
  * @date 4 October 2020
 */

/**
* Filename:             STAT-server/models/attendanceEntry.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   4 October  2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the Attendance model in our database
*
*/

const mongoose = require("mongoose")

var UserAttendanceSchema = new mongoose.Schema({
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        required : "ID required.",
        unique: true
    },
    AttendanceEntries: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'TimeEntry' 
        }
    ]
});

mongoose.model("UserAttendance", UserAttendanceSchema);
