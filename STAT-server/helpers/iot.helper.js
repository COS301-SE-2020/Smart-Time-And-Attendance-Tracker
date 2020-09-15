/**
  * @file STAT-server/helper/iot.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This is a helper file to handle IOTDevices related requests.

  * @date 15 July 2020
 */

/**
* Filename:             STAT-server/helper/iot.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   15 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This is a helper file to handle IOTDevices related requests.
*
*/
const mongoose = require("mongoose");
const IOTDeviceModel = mongoose.model("IOTDevice");

/**
 * This function gets the MAC address of a device.
 * @param {String} id ID of deive
 * @param {Function} done 
 */
module.exports.getProject = (id, done)=>{
    IOTDeviceModel.findOne({_id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, result);
        
    });
}