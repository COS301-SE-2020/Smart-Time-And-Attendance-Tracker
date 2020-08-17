
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
var Promise = require('promise');
var async = require("async");
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
 * Returns info for all the time entries of the user.
 * @param {Array} ids IDs of time entries.
 * @param {Object} user The user who's time entries are being fetched.
 * @param {*} done 
 * @returns {Object} Time Entry document(object).
 */

module.exports.getAllTimeEntries = async (ids,req)=> {
    return new Promise(function(resolve, reject) { 
        entries = [];
        if(req.hasOwnProperty("minDate"))
        {
            var min = new Date(req.minDate).getTime();
            if(req.hasOwnProperty("maxDate"))
            {
                var max = new Date(req.maxDate);
                max.setDate(max.getDate() + 1);
                max = max.getTime()
            }
            else
                var max = new Date().getTime(); 

             ids.forEach((id) => { 
                entries.push(
                        TimeEntryModel.findOne({_id: id,  StartTime: {$gte: min,$lte: max}}).then((result) => {
                            if(result){
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
                                return text;
                            }
                        }).catch((err) => reject(err)));
            });
            Promise.all(entries).then((result) => {
                resolve(result);  
            }).catch((err) => reject(err));
        }
        else{
            ids.forEach((id) => { 
            entries.push(
                    TimeEntryModel.findOne({_id: id}).then((result) => {
                        if(result){
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
                            return text;
                        }
                    }).catch((err) => reject(err)));
        });
        Promise.all(entries).then((result) => {
            resolve(result);  
        }).catch((err) => reject(err));
            
        }
    });
}
 /**
 * Returns info for all the time entries of the user made for a specific project.
 * @param {Array} ids IDs of time entries.
 * @param {Object} user The user who's time entries are being fetched.
 * @param {*} done 
 * @returns {Object} Time Entry document(object).
 */

module.exports.getAllTimeEntriesForProject = async (ids, project,req)=> {
    return new Promise(function(resolve, reject) { 
        entries = [];
        if(req.hasOwnProperty("minDate"))
        {
            var min = new Date(req.minDate).getTime();
            if(req.hasOwnProperty("maxDate"))
            {
                var max = new Date(req.maxDate);
                max.setDate(max.getDate() + 1);
                max = max.getTime()
            }
            else
                var max = new Date().getTime(); 

             ids.forEach((id) => { 
                entries.push(
                        TimeEntryModel.findOne({_id: id, ProjectID: project,  StartTime: {$gte: min,$lte: max}}).then((result) => {
                            if(result){
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
                                return text;
                            }
                        }).catch((err) => reject(err)));
            });
            Promise.all(entries).then((result) => {
                resolve(result);  
            }).catch((err) => reject(err));
        }
        else{
            ids.forEach((id) => { 
            entries.push(
                    TimeEntryModel.findOne({_id: id, ProjectID: project}).then((result) => {
                        if(result){
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
                            return text;
                        }
                    }).catch((err) => reject(err)));
        });
        Promise.all(entries).then((result) => {
            resolve(result);  
        }).catch((err) => reject(err));
            
        }
    });
}