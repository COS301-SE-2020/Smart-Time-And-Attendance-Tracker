/**
  * @file STAT-server/models/iotDevice.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file contains the IOT Device model in our database
  * @date 19 August 2020
 */

/**
* Filename:             STAT-server/models/iotDevice.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   19 August 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the IOT Device model in our database
*
*/ 

const mongoose = require("mongoose")

var IOTDeviceSchema = new mongoose.Schema({
    DeviceName:{
        type: String,
        required : "Required"        
    },
    MACAddress:{
        type: String,
        required : "Required",
        unique: true
    },
    RegisteredBy:{
        type: mongoose.Schema.Types.ObjectId,
        required : "ID required."
    },
    RegisteredOn:{
        type: String,
        required : "Required"
    },
    Description:{
        type: String,
        default:""
    },
    DeregisteredBy:{
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    DeregisteredOn:{
        type: String,
        default: ""
    }
});

mongoose.model("IOTDevice", IOTDeviceSchema);

