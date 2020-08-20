/**
  * @file STAT-server/models/organisation.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the Organisation model in our database
  * @date 11June 2020
 */

/**
* Filename:             STAT-server/models/organisation.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the Organisation model in our database
*
*/ 
const mongoose = require("mongoose")

var OrganisationSchema = new mongoose.Schema({
    OrganisationName:{
        type: String,
        required : "Required"
    },
    SystemAdminstrator:{
        type: Array,
        required : "Required"
    }, 
    SecurityAdminstrator:{
        type: Array,
    },
    DataAnalyst:{
        type: Array,
    }
});

mongoose.model("Organisation", OrganisationSchema);