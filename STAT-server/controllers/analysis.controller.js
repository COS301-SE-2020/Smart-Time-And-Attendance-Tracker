/**
  * @file STAT-server/controllers/predictive.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding predictive analysis
  * @date  26 August 2020
 */

/**
* Filename:             STAT-server/controllers/predictive.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   26 August 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the predictive analysis
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
 * this function receives user id and calculates users average time
 * @param {user id} req 
 * @param {average time} res 
 */
module.exports.getUserAverageTime = (req, res) => {  
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
            var averageTime=0;
            var times = result.TimeEntries.length;
           
            if(times == 0){   ///return average  = 0;
                return res.status(404).json({ message: 'No time entries for the given user were found' });
            }
            else{
                if(req.query.hasOwnProperty("projectID")) ///return average on a certain project
                {
                    var totalEntries =0;
                   for(var a=0; a<times; a++){
                        TimeEntryModel.findOne({_id: result.TimeEntries[a], ProjectID: req.query.ProjectID},(err,val)=>{   
                            count3= count3+1; 
                            if(err){
                                return res.status(500).send({message: 'Internal Server Error: ' + error});

                            }
                            else if(val){
                                count = false;
                                totalEntries=totalEntries+1;
                               // console.log(totalEntries)
                                averageTime = averageTime + val.ActiveTime;
                            
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                averageTime=averageTime/totalEntries;
                                return res.status(200).json({averageTime}); 
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
                                averageTime = averageTime + val.ActiveTime;
                            };
                            if(count3 == times && count){
                                return res.status(404).json({ message: 'No time entries were found' });
                            } 
                            else if(count3== times){
                                averageTime=averageTime/times;
                                return res.status(200).json({averageTime}); 
                            }
                        });
                    }
                }
                
            }
        }
    });
}