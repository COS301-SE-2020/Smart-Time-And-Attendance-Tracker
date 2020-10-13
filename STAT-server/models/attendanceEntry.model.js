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
const mongoose = require('mongoose');

const AttendanceSchema = mongoose.Schema({
  StartTime: {
    type: Number,
    required: "Start time required."
  },
  EndTime: {
    type: Number,
    required: "End time required."
  },
  Date: { 
    type: String,
    required: "Date required."
  },
  Device: { 
    type: String,
    required: "Device required."
  },
});

module.exports = mongoose.model('AttendanceEntry', AttendanceSchema);