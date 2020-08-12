/**
  * @file STAT-server/models/calendarEvents.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file contains the calendarEvents model in our database
  * @date 12 August 2020
 */

/**
* Filename:             STAT-server/models/calendarEvents.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   12 August 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the calendarEvents model in our database
*
*/
const mongoose = require("mongoose")

var CalendarEventsSchema = new mongoose.Schema({
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        required : "ID required.",
        unique: true
    },
    Events:[
        { 
            ID : {
                type: String
            },
            EndTime: {
                type: Number
            },
        }
    ]
});

mongoose.model("calendarEvents", CalendarEventsSchema);