/**
  * @file STAT-server/helper/userTimeEntry.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the UserTimeEntry and TimeEntry models in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/helper/userTimeEntry.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the UserTimeEntry and TimeEntry models in our database
*
*/ 

const mongoose = require("mongoose");
const TaskHelper = require("../helpers/task.helper");
const ProjectHelper = require("../helpers/project.helper");
const UserTimeEntryModel = mongoose.model("UserTimeEntry");
const TimeEntryModel = mongoose.model("TimeEntry");
const UserModel = mongoose.model("User");
const TimeEntryHelper =  require('../helpers/timeEntry.helper');
const UserHelper =require('../helpers/user.helper');
const ProjectModel = mongoose.model("Project");
var Promise = require('promise');
var async = require("async");

/**
 * This function adds a time entry to the database.
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * @returns {JSON Object} success or error message
 */
module.exports.addTimeEntry = (req, res) => {  
    var timeEntry = new TimeEntryModel();
    timeEntry.Date = req.body.date;
    timeEntry.StartTime = req.body.startTime;
    timeEntry.EndTime = req.body.endTime;
    if(req.body.taskID)
    {
        timeEntry.TaskID = req.body.taskID;
        timeEntry.TaskName = req.body.taskName;
    }
    else
    {
        timeEntry.TaskID = null;
        timeEntry.TaskName = 'Unspecified';
    }

    if(req.body.projectID)
    {
        timeEntry.ProjectID = req.body.projectID;
        timeEntry.ProjectName = req.body.projectName;
    }
    else
    {
        timeEntry.ProjectID = null;
        timeEntry.ProjectName = 'Unspecified';
    }

    if(req.body.activeTime)
        timeEntry.ActiveTime = req.body.activeTime;
    else
        timeEntry.ActiveTime = 0;

    if(req.body.monetaryValue)
            timeEntry.MonetaryValue = req.body.monetaryValue;
    else
        timeEntry.MonetaryValue = 0;

    timeEntry.Description = req.body.description;
    timeEntry.Device = req.body.device;

    timeEntry.save((error, timeEntryDoc) => {
        if(!error)
        {
            UserTimeEntryModel.findOne({UserID : req.ID}, function(err, result) {
                if(err) 
                {
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                }
                else if (!result)
                {
                    var userTimeEntry = new UserTimeEntryModel();
                    userTimeEntry.UserID = req.ID;
                    userTimeEntry.TimeEntries = [timeEntryDoc];
                    userTimeEntry.save((err, doc) => {
                    if(!err)
                        return res.status(200).json({ timeEntryID: timeEntryDoc._id, message: 'Time recorded successfully' });
                    else 
                    {
                        if (err.code == 11000)
                            res.status(409).send({message: 'Time record already exists'});
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        }
                    });
                }
                else {
                    result.TimeEntries.push(timeEntryDoc);
                    result.save((err, doc) => {
                        if(!err)
                            return res.status(200).json({timeEntryID: timeEntryDoc._id, message: 'Time recorded successfully' });
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                    });
                }
            });
        }

        else 
        {
            if (error.code == 11000)
                res.status(409).send({message: 'Time record already exists'});
            else
                return res.status(500).send({message: 'Internal Server Error: ' + error});
        }
    });     
}

/**
 * This function adds entries passed from the trackerManager
 * @param {JSON Object} entry Time entry to add
 * @param {String} id The user's ID.
 */
module.exports.addTimeEntryFromManager = async(entry, id) => { 
    return new Promise(function(resolve, reject) { 
    
        var timeEntry = new TimeEntryModel();
        timeEntry.Date = entry.date;
        timeEntry.StartTime = entry.startTime;
        timeEntry.EndTime = entry.endTime;
        timeEntry.TaskID = null;
        timeEntry.TaskName = 'Unspecified';
        timeEntry.ProjectID = null;
        timeEntry.ProjectName = 'Unspecified';
        timeEntry.ActiveTime = entry.activeTime;
        timeEntry.MonetaryValue = 0;
        timeEntry.Description = entry.description;
        timeEntry.Device = entry.device;

        timeEntry.save((error, timeEntryDoc) => {
            if(!error)
            {
                UserTimeEntryModel.findOne({UserID : id}, function(err, result) {
                    if(err) 
                        reject(err);

                    else if (!result)
                    {
                        var userTimeEntry = new UserTimeEntryModel();
                        userTimeEntry.UserID = req.ID;
                        userTimeEntry.TimeEntries = [timeEntryDoc];
                        userTimeEntry.save((err, doc) => {
                        if(!err)
                            resolve();
                        else 
                            reject(err);
                        });
                    }
                    else {
                        result.TimeEntries.push(timeEntryDoc);
                        result.save((err, doc) => {
                            if(!err)
                                resolve();
                            else
                                reject(err);
                        });
                    }
                });
            }

            else 
                reject(error);
        });     
    });
}
//Update the time enty
//Request body - Has values to update
//Response - Success or error message       
/**
 * This function imports a time entry to the database.
 * @param {HTTP Request} req Receives all entry details plus the user id as part of the body
 * @param {HTTP Response} res 
 * @returns {JSON Object} success or error message
 */
module.exports.importTimeEntry = (req, res) => { 
    if(!req.body.hasOwnProperty('userID'))
        return res.status(400).send({message: 'No user ID given'});

    var timeEntry = new TimeEntryModel();
    timeEntry.Date = req.body.date;
    timeEntry.StartTime = req.body.startTime;
    timeEntry.EndTime = req.body.endTime;
    if(req.body.taskID)
    {
        timeEntry.TaskID = req.body.taskID;
        timeEntry.TaskName = req.body.taskName;
    }
    else
    {
        timeEntry.TaskID = null;
        timeEntry.TaskName = 'Unspecified';
    }

    if(req.body.projectID)
    {
        timeEntry.ProjectID = req.body.projectID;
        timeEntry.ProjectName = req.body.projectName;
    }
    else
    {
        timeEntry.ProjectID = null;
        timeEntry.ProjectName = 'Unspecified';
    }

    if(req.body.activeTime)
        timeEntry.ActiveTime = req.body.activeTime;
    else
        timeEntry.ActiveTime = 0;

    if(req.body.monetaryValue)
            timeEntry.MonetaryValue = req.body.monetaryValue;
    else
        timeEntry.MonetaryValue = 0;

    timeEntry.Description = req.body.description;
    timeEntry.Device = req.body.device;

    timeEntry.save((error, timeEntryDoc) => {
        if(!error)
        {
            UserTimeEntryModel.findOne({UserID : req.body.userID}, function(err, result) {
              
                if(err) 
                {
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                }
                else if (!result)
                {
                    var userTimeEntry = new UserTimeEntryModel();
                    userTimeEntry.UserID = req.body.userID;
                    userTimeEntry.TimeEntries = [timeEntryDoc];
                    userTimeEntry.save((err, doc) => {
                    if(!err)
                        return res.status(200).json({ timeEntryID: timeEntryDoc._id, message: 'Time recorded successfully' });
                    else 
                    {
                        if (err.code == 11000)
                            res.status(409).send({message: 'Time record already exists'});
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        }
                    });
                }
                else {
                    result.TimeEntries.push(timeEntryDoc);
                    result.save((err, doc) => {
                        if(!err)
                            return res.status(200).json({timeEntryID: timeEntryDoc._id, message: 'Time recorded successfully' });
                        else
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                    });
                }
            });
        }
        else 
        {
            if (error.code == 11000)
                res.status(409).send({message: 'Time record already exists'});
            else
                return res.status(500).send({message: 'Internal Server Error: ' + error});
        }
    });     
}
/**
 * This function updates a time entry.
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * @returns {JSON Object} success or error message
 */    
module.exports.updateTimeEntry = (req, res) => {  
    if(!req.body.hasOwnProperty('timeEntryID'))
        return res.status(400).send({message: 'No time entry ID given'});

    UserTimeEntryModel.findOne({UserID: req.ID, TimeEntries: req.body.timeEntryID },(err, result) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if(!result)
            return res.status(404).json({message: 'Time entry does not belong to user'});
        else
        {
            TimeEntryModel.findOne({ _id: req.body.timeEntryID},(err, result) => {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else if(!result)
                    return res.status(404).json({message: 'Time entry not found'});
                else
                {
                    if(req.body.hasOwnProperty('projectID'))
                    {
                        if(req.body.projectID == null)
                        {
                            result.TaskID = null;
                            result.TaskName = "Unspecified";
                            result.ProjectName = "Unspecified";
                        }
                        else if(req.body.hasOwnProperty('projectName'))
                            result.ProjectName =  req.body.projectName;

                        result.ProjectID =  req.body.projectID;
                    }

                    if(req.body.hasOwnProperty('taskID') )
                    {
                        if(req.body.taskID == null)
                        {
                            result.TaskName = "Unspecified";
                        }
                        else if(req.body.hasOwnProperty('taskName'))
                            result.TaskName = req.body.taskName;

                        result.TaskID =  req.body.taskID;
                    }

                    if(req.body.hasOwnProperty('startTime'))
                        result.StartTime =  req.body.startTime;

                    if(req.body.hasOwnProperty('endTime'))
                        result.EndTime =  req.body.endTime;
                        
                    if(req.body.hasOwnProperty('activeTime'))
                        result.ActiveTime =  req.body.activeTime;

                    if(req.body.hasOwnProperty('date'))
                        result.Date =  req.body.date;

                    if(req.body.hasOwnProperty('description'))
                        result.Description =  req.body.description;
                        
                    if(req.body.hasOwnProperty('monetaryValue'))
                        result.MonetaryValue =  req.body.monetaryValue;
                
                        TimeEntryModel.updateOne({ _id: req.body.timeEntryID},{TaskName: result.TaskName, TaskID:result.TaskID,
                            ProjectName : result.ProjectName, ProjectID: result.ProjectID, StartTime: result.StartTime,EndTime: result.EndTime,
                            ActiveTime: result.ActiveTime, Date: result.Date, Description: result.Description, MonetaryValue: result.MonetaryValue },(err, result) => {
                            if (err) 
                                return res.status(500).send({message: 'Internal Server Error: ' + err});
                            else
                                return res.status(200).json({message: 'Time entry successfully updated'});
                        
                        });
                    
                }
           
            });
        }
    });

}

/**
 * This function finds all time entries for specified date. Uses TaskHelper to get TaskName from TaskID.
 * @param {HTTP Request} req Parameters - Date string
 * @param {HTTP Response} res 
 * @returns {JSON Object} Array of time entry objects
 */    
module.exports.getDailyTimeEntries = (req, res) => {  
    if(!req.query.hasOwnProperty('date'))
        return res.status(400).send({message: 'No date provided'}); 
    var count = true;
    var count3 = 0;
    UserTimeEntryModel.findOne({  UserID : req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
        {
            var date = req.query.date;
            var timeEntries=[];
            var times = result.TimeEntries.length
            if(times == 0)
                return res.status(404).json({ message: 'No time entries for the given user were found' });
            else
            {
                for(var a=0; a<times; a++)
                {
                    TimeEntryModel.findOne({_id: result.TimeEntries[a]},(err,val)=>
                    {   
                        count3= count3+1; 
                        
                        if(err)
                            return res.status(500).send({message: 'Internal Server Error: ' + error});

                        else if(val)
                        {
                            if(date == val.Date)
                            {
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, project: val.ProjectName,task: val.TaskName, activeTime: val.ActiveTime, monetaryValue:val.MonetaryValue});
                            }
            
                        };
                        if(count3 == times && count)
                            return res.status(404).json({ message: 'No time entries for the given day were found' });
                        else if(count3== times)
                            return res.status(200).json({timeEntries}); 

                    
                    });
                }
            }
        }
    });
}


/**
 * This function  deletes a time entry.
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} Success or error message
 */  
module.exports.deleteTimeEntry = (req, res) => {  
    if(!req.body.hasOwnProperty('timeEntryID'))
        return res.status(400).send({message: 'No time entry ID provided'}); 
    UserTimeEntryModel.updateOne({  UserID : req.ID},{ $pull: { 'TimeEntries':  req.query.timeEntryID}},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (result.n == 0)
            return res.status(404).json({ message: 'No time entries for the given user were found' }); 
        else
        {        
            TimeEntryModel.deleteOne({_id : req.query.timeEntryID},(errs,vals) =>{
                if(errs)
                    return res.status(500).send({message: 'Internal Server Error: ' + errs});
                else if (vals.n == 0) 
                    return res.status(404).json({ message: 'Time entry not found' });
                else 
                    return res.status(200).json({ message: 'Time entry deleted' });
                
            });
        }
    });
}


/**
 * This function returns all time entries for the user.
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} returns all time entries and entry information in an array ie - name, email
 */  
module.exports.getOwnTimeEntries = (req, res) => {  
    var count = true;
    var count3 = 0;
    UserTimeEntryModel.findOne({  UserID : req.ID},(err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'No time entries for the given user were found' }); 
        }
        else{
            var timeEntries=[];
            var times = result.TimeEntries.length
           
            if(times == 0){
                return res.status(404).json({ message: 'No time entries were found' });
            }
            else{
                if(req.query.hasOwnProperty("minDate"))
                {
                    var min = new Date(req.query.minDate).getTime();
                    if(req.query.hasOwnProperty("maxDate"))
                    {
                        var max = new Date(req.query.maxDate);
                        max.setDate(max.getDate() + 1);
                        max = max.getTime()
                    }
                    else
                     var max = new Date().getTime(); 
                
                    for(var a=0; a<times; a++){
                        TimeEntryModel.findOne({_id: result.TimeEntries[a], StartTime: {$gte: min,$lte: max}},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, description: val.Description,project: val.ProjectName,task: val.TaskName, activeTime: val.ActiveTime, monetaryValue:val.MonetaryValue});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({timeEntries}); 
                            }
                        });
                    }
                }
                else{
                    for(var a=0; a<times; a++){
                        TimeEntryModel.findOne({_id: result.TimeEntries[a]},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, description: val.Description,project: val.ProjectName,task: val.TaskName, activeTime: val.ActiveTime, monetaryValue:val.MonetaryValue});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({timeEntries}); 
                            }
                        });
                    }
                }
            }
        }
    });
}

/**
 * This function returns all time entries for the user.
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} returns all time entries and entry information in an array ie - name, email
 */  
module.exports.getUserTimeEntries = (req, res) => {  
    var count = true;
    var count3 = 0;
    if(!req.query.hasOwnProperty("userID"))
        return res.status(400).send({message: 'No user ID provided'});

    UserTimeEntryModel.findOne({  UserID : req.query.userID},(err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'No time entries for the given user were found' }); 
        }
        else{
            var timeEntries=[];
            var times = result.TimeEntries.length;
           
            if(times == 0){
                return res.status(404).json({ message: 'No time entries for the given user were found' });
            }
            else{
                if(req.query.hasOwnProperty("minDate"))
                {
                    var min = new Date(req.query.minDate).getTime();
                    if(req.query.hasOwnProperty("maxDate"))
                    {
                        var max = new Date(req.query.maxDate);
                        max.setDate(max.getDate() + 1);
                        max = max.getTime()
                    }
                    else
                        var max = new Date().getTime(); 
                
                    for(var a=0; a<times; a++){
                        TimeEntryModel.findOne({_id: result.TimeEntries[a], StartTime: {$gte: min,$lte: max}},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, description: val.Description,project: val.ProjectName,task: val.TaskName, activeTime: val.ActiveTime, monetaryValue:val.MonetaryValue});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({timeEntries}); 
                            }
                        });
                    }
                }
                else{
                    for(var a=0; a<times; a++){
                        TimeEntryModel.findOne({_id: result.TimeEntries[a]},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                timeEntries.push({timeEntryID: val._id, date:val.Date, startTime:val.StartTime, endTime:val.EndTime, duration:val.Duration, description: val.Description,project: val.ProjectName,task: val.TaskName, activeTime: val.ActiveTime, monetaryValue:val.MonetaryValue});
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                return res.status(200).json({timeEntries}); 
                            }
                        });
                    }
                }
                
            }
        }
    });
}

/*
   doesnt receive any parameters
   returns an array with all users + time entries for each user
           - user basic infor 
           - time entries and entry information
    ie - name, email
    {
        "timeEntries" : [
                  {
                      name, email
                      time entries arrsy[]
                  },
        ]
    }
*/
/**
 * This function returns returns an array with all users + time entries for each user
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} 
 */  
module.exports.getAllUsersTimeEntries = async function(req, res) {  
    var count4 =0;
    var timeEntries=[];
    UserHelper.getAllUsers(async (err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'No users found' }); 
        }
        else{
            var finalobject=[];
            var allcounts=result.length;
            result.forEach( async function(myDoc){ 
                count4=count4+1;
                var userid=myDoc.ID;
                var name =myDoc.name;
                var surname=myDoc.surname;
                var email=myDoc.email;

                UserTimeEntryModel.findOne({  UserID :userid},async (err, result) => {
                    if (err) {
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    }
                    else if (!result){ ///no time entries for this user
                        finalobject.push({ name:name, surname:surname, email:email, timeEntries:[] });
    
                        if (count4 == allcounts && finalobject.length == allcounts)  {
                            return res.status(200).json({results: finalobject}); 
                         }

                    }
                    else{
                        timeEntries=[];
                        if(result.TimeEntries.length == 0){  
                            finalobject.push({ name:name, surname:surname, email:email, timeEntries:[] });
                            if (count4 == allcounts && finalobject.length == allcounts)  {
                                return res.status(200).json({finalobject}); 
                             }
                        }
                        else{
                               
                            try {
                                const  val = await TimeEntryHelper.getAllTimeEntries(result.TimeEntries,req.query);
                                var filtered = val.filter(function (el) {
                                    return el != null;
                                  });
                                finalobject.push({ name:name, surname:surname, email: email, timeEntries: filtered });
                                
                                if (count4 == allcounts && finalobject.length == allcounts)  {
                                return res.status(200).json({results: finalobject});
                                }
                            } 
                            catch (error) {
                                return res.status(500).send({message: 'Internal Server Error: ' + err})
                           }
                        }
                    }
                });
            });
        }
    });
}
/**
 *    receives a project id
 *    returns an array of users and each users time entries
 *    with basic user and project details
 */

 /**
 * This function returns returns an array with all users + time entries for each user for a specific project
 * @param {HTTP Request} req Parameters - Time entry ID
 * @param {HTTP Response} res 
 * @returns {JSON Object} 
 */ 
module.exports.getAllProjectMembersTimeEntries = async (req, res) => {  
    if(!req.query.hasOwnProperty("projectID"))
        return res.status(400).send({message: 'No project ID provided'});
    var projectID=req.query.projectID;
    var count4 =0;
    ProjectHelper.getProject(projectID, (err, result) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result){
            return res.status(404).json({ message: 'Project not found' }); 
        }
        else{
            var finalobject={};
            finalobject.projectName=result.ProjectName;
            finalobject.dueDate=result.DueDate;
            finalobject.hourlyRate=result.HourlyRate;
            finalobject.completed=result.Completed;
            finalobject.TeamMembers=[]

            var allcounts=result.TeamMembers.length;
            result.TeamMembers.forEach( async function(myDoc){ 
                count4=count4+1;

                UserHelper.getUserDetails(myDoc._id, async(err, result) => {
                    if (err) { 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    }
                    else{

                        var name =result.name;
                        var surname=result.surname;
                        var email=result.email;
                        var role = result.role;

                        UserTimeEntryModel.findOne({  UserID : result.ID},async (err, result) => {
                    
                            if (err) {
                                return res.status(500).send({message: 'Internal Server Error: ' + err});
                            }
                            else if (!result){ ///no time entries for this user
                                finalobject.TeamMembers.push({ name:name, surname:surname, email:email, role: role,timeEntries: [] });
                                if (count4 == allcounts && finalobject.TeamMembers.length == allcounts)  {
                                    return res.status(200).json({results: finalobject}); 
                                    }
        
                            }
                            else{

                                var times = result.TimeEntries.length
                            
                                if(times == 0){  

                                    finalobject.TeamMembers.push({name:name, surname:surname, email:email, role: role,timeEntries: []});
                                    if (count4 == allcounts && finalobject.TeamMembers.length == allcounts)  {

                                        return res.status(200).json({results: finalobject}); 
                                        }
                                }
                                else{
                                    ///
                                    timeEntries=[];
                                    try {
                                        const  val = await TimeEntryHelper.getAllTimeEntriesForProject(result.TimeEntries, projectID,req.query);
                                        var filtered = val.filter(function (el) {
                                            return el != null;
                                          });
                                        finalobject.TeamMembers.push({ name:name, surname:surname, email: email, timeEntries: filtered });
                                        
                                        if (count4 == allcounts && finalobject.TeamMembers.length == allcounts)  {
                                            return res.status(200).json({results: finalobject}); 
                                        }
                                    } 
                                    catch (error) {
                                        return res.status(500).send({message: 'Internal Server Error: ' + err})
                                   
                                        }
                                   
                                    }
                                }
                            });

                        }
                });
            });
        }
    });
}


           







