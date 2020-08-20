/**
  * @file STAT-server/models/userTimeEntry.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the UserTimeEntry model in our database
  * @date 3 July 2020
 */

/**
* Filename:             STAT-server/models/userTimeEntry.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   3 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the UserTimeEntry model in our database
*
*/
const mongoose = require("mongoose")

var UserTimeEntrySchema = new mongoose.Schema({
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        required : "ID required.",
        unique: true
    },
    TimeEntries: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'TimeEntry' 
        }
    ]
});

mongoose.model("UserTimeEntry", UserTimeEntrySchema);
