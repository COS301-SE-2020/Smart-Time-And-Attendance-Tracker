/**
  * @file STAT-server/models/team.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the Team model in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/models/team.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the Team model in our database
*
*/
const mongoose = require("mongoose")

var TeamSchema = new mongoose.Schema({
    TeamName : {
        type: String,
        required : "Required"
    },
    TeamMembers:[
        { 
            _id : {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            Role: {
                type: String
            }
        }
    ]
});

mongoose.model("teams", TeamSchema);