/**
  * @file STAT-server/helper/timeEntry.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles some of the requests regarding timeEntry model in our database. 
  * This is a helper file to handle timeEntry related requests.
  * @date 8 July 2020
 */

/**
* Filename:             STAT-server/helper/timeEntry.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   8 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles some of the requests regarding timeEntry model in our database. 
*                       This is a helper file to handle timeEntry related requests.
*
*/
const mongoose = require("mongoose");
const TimeEntryModel = mongoose.model("TimeEntry");

/**
 * 
 * @param {String} id ID of time entry.
 * @param {*} done 
 * @returns {Object} Time Entry document(object).
 */
module.exports.getTimeEntry = (id, done)=>{
    TimeEntryModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, result);
        
    });
}

/**
 * 
 * @param {Array} ids IDs of time entries.
 * @param {Object} user The user who's time entries are being fetched.
 * @param {*} done 
 * @returns {Object} Time Entry document(object).
 */
module.exports.getAllTimeEntries = (ids, user, done)=>{
    entries = [];
    len = ids.length;
    console.log('len' + ids.length);
    for(i=0; i< ids.length; i++){
        TimeEntryModel.find({_id: ids[0]},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            len = len -1;
        else if(result)
        {
            var text = {
                'timeEntryID': result._id,
                'date': result.Date,
                'description': result.Description,
                'startTime': result.StartTime,
                'endTime': result.EndTime,
                'duration':result.Duration, 
                'project': result.ProjectName,
                'task': result.TaskName, 
                'activeTime': result.ActiveTime, 
                'monetaryValue':result.MonetaryValue
                }
                entries.push(text)
            }
            if(entries.length == len)
                done(null, entries,user);        
        });
    }
}