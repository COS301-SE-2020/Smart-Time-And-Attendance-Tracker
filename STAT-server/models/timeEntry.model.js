/**
  * @file STAT-server/models/timeEntry.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the TimeEntry model in our database
  * @date 3 July 2020
 */

/**
* Filename:             STAT-server/models/timeEntry.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   3 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the TimeEntry model in our database
*
*/
const mongoose = require('mongoose');

const TimeEntrySchema = mongoose.Schema({
  TaskID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Task',
    required : "Task ID required."
  },
  ProjectID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project',
    required : "Project ID required."
  },
  StartTime: {
    type: Number,
    required: "Start time required."
  },
  EndTime: {
    type: Number,
    required: "End time required."
  },
  ActiveTime: {
    type: Number,
    required: "Duration required."
  },
  Date: { 
    type: String,
    required: "Date required."
  },
  Description: { 
    type: String,
    required: "Description of time entry is required."
  },
  Device: { 
    type: String,
    required: "Device required."
  },
  MonetaryValue: { 
    type: Number
  },
  ProjectName: { 
    type: String,
    required: "Project name required."
  },
  TaskName: { 
    type: String,
    required: "Task name required."
  },

});

module.exports = mongoose.model('TimeEntry', TimeEntrySchema);