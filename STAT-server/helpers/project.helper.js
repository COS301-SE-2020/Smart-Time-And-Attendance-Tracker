/**
  * @file STAT-server/helper/project.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles some of the requests regarding Project model in our database. 
  * This is a helper file to handle Project related requests.
  * @date 15 July 2020
 */

/**
* Filename:             STAT-server/helper/project.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   15 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles some of the requests regarding Project model in our database. 
*                       This is a helper file to handle Project related requests.
*
*/
const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");
const TaskHelper =require('../helpers/task.helper');

/**
 * This function assigns a team to a project.
 * @param {String} id ID of project
 * @param {String} teamID ID of team
 * @param {*} done 
 */
module.exports.addTeam = (id, teamID, done)=>{
    ProjectModel.updateOne({_id: id},{Team: teamID},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, true);
        
    });
}

/**
 * This funtion returns the hourly rate of a project.
 * @param {String} id ID of project.
 * @param {*} done 
 * @returns {Number} returns the hourly rate of a project. 
 */
module.exports.hourlyRate = (id, done)=>{
    ProjectModel.find({_id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, result.HourlyRate);
        
    });
}

/**
 * This function returns the tasks of the project, and additional details about the project such as, 
 * project name, project ID, due date of project, and the hourly rate of the project.
 * @param {String} id ID of project.
 * @param {*} done Returns the tasks of the project, and additional details about the project such as, 
 * project name, project ID, due date of project, and the hourly rate of the project.
 */
module.exports.getTasks = (id, done)=>{
    ProjectModel.findOne({ _id: id},{ Completed: false},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
        {
            var values = [], task=0, text="";
            if(result.Tasks.length ==0)
            {
                text = {
                    'ID': result._id,
                    'projectName': result.ProjectName,
                    "dueDate": result.DueDate,
                    "hourlyRate": result.HourlyRate,
                    "tasks": []

                }
                done(null, text);
            }
            for(task; task<result.Tasks.length; task++) 
            {
                TaskHelper.getTaskName(result.Tasks[task],(err,val)=> {
                    if(err)
                        done(err);
                    else if(val)
                    {
                        values.push(val); 
                        if(values.length == result.Tasks.length)
                        {
                            text = {
                                'ID': result._id,
                                'projectName': result.ProjectName,
                                "dueDate": result.DueDate,
                                "hourlyRate": result.HourlyRate,
                                'tasks': values

                            }
                            done(null, text);
                        }                       
                    }
                });
            }
            
        }
           
        
    });
}

