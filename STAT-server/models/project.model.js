/**
  * @file project.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the Project model in our database
  * @date 11June 2020
 */

/**
* Filename:             STAT-server/models/Project.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the Project model in our database
*
*/ 

const mongoose = require("mongoose")

var ProjectSchema = new mongoose.Schema({ 
    ProjectName:{
        type: String,
        required : "Required"
    },
    TimeSpent:{
        type: Number
        //required : "Required"
    },
    StartDate:
    {
        type: String,
        required : "Required"
    },
    DueDate:{
        type: String,
        required : "Required"
    },
    Tasks: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Task' 
        }
    ],
    Team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' 
    },
    Completed:{
        type: Boolean
    },
    HourlyRate:
    {
        type: Number,
        required : "Required"
    }
});

mongoose.model("Project", ProjectSchema);