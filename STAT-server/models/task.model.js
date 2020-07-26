/**
  * @file task.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the Task model in our database
  * @date 11June 2020
 */

/**
* Filename:             STAT-server/models/task.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the Task model in our database
*
*/
const mongoose = require("mongoose")

var TaskSchema = new mongoose.Schema({    
    TaskName:{
        type: String,
        required : "Required"
    },
    StartDate:{
        type: String,
        required : "Required"
    },
    DueDate:{
        type: String,
        required : "Required"
    },
    TimeSpent:{
        type: Number
        //required : "Required"
    },
    /*ExpectedCost:{
        type: Number,
        required : "Required"
    },*/
    MonetaryValue:{
        type: Number
       // required : "Required"
    },
    Status:{
        type: String,
        enum : ['Not Started', 'In Progress', 'Completed'], 
        default: 'Not Started' 
    }
});

mongoose.model("Task", TaskSchema);