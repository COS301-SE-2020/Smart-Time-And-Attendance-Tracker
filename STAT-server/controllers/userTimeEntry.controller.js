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
//Update the time enty
//Request body - Has values to update
//Response - Success or error message       
module.exports.updateTimeEntry = (req, res) => {  
    TimeEntryModel.findOne({ _id: req.body.timeEntryID},(err, result) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if(!result)
            return res.status(404).json({message: 'Time entry not found'});
        else
        {
            if(req.body.hasOwnProperty('taskName'))
                 result.TaskName = req.body.taskName;

            if(req.body.hasOwnProperty('taskID'))
                result.TaskID =  req.body.taskID;

            if(req.body.hasOwnProperty('projectName'))
                result.ProjectName =  req.body.projectName;

            if(req.body.hasOwnProperty('projectID'))
                result.ProjectID =  req.body.projectID;

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


// Finds al time entries for specified date. Uses TaskHelper to get TaskName from TaskID.
//Parameters - Date string
// Returns - Array of time entry objects
module.exports.getDailyTimeEntries = (req, res) => {  
    if(!req.query.date)
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


/* This function receives user ID, jwtTOKEN and a time entry ID
   it authenthenticates ID and the token from the index.router and 
   then deletes the item
*/
module.exports.deleteTimeEntry = (req, res) => {  
    if(!req.query.timeEntryID)
        return res.status(400).send({message: 'No time entry ID provided'}); 
    UserTimeEntryModel.updateOne({  UserID : req.ID},{ $pull: { 'TimeEntries':  req.query.timeEntryID}},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No time entries for the given user were found' }); 
        else
        {        
            TimeEntryModel.deleteOne({_id : req.query.timeEntryID},(errs,vals) =>{
                if(errs)
                    return res.status(500).send({message: 'Internal Server Error: ' + errs});
                else if (!vals) 
                    return res.status(404).json({ message: 'Time entry not found' });
                else 
                    return res.status(200).json({ message: 'Time entry deleted' });
                
            });
        }
    });
}
