/**
  * @file STAT-server/models/index.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview 
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/models/userTimeEntry.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          
*
*/
const mongoose = require("mongoose")

var testing="";
var uri = "mongodb+srv://TeamVisionary:Capstone301@cluster0-ocdej.azure.mongodb.net/Smart-Time-And-Attendance-Tracker?retryWrites=true&w=majority"; 
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (error,db)=>{

    if(!error)
    {
        testing=db;
        console.log("Sucess Connected")
    }
    else{
        console.log("Error connecting to database.")
    }
});


