

/**
  * @file STAT-server/controllers/project.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the Project model in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/controllers/project.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the Project model in our database
*
*/ 

const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");
const TaskHelper = require("../helpers/task.helper");
const TeamHelper = require("../helpers/team.helper");
const UserHelper = require("../helpers/user.helper");


/**
 * Thos function changes the status of the project to incomplete.
 * @param {HTTP Request} req Request body - ID of Project
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.uncomplete = (req, res) => {
    ProjectModel.updateOne({ _id: req.body.projectID},{Completed: false},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'Project not found' }); 
        else
            return res.status(200).json({message: 'Project marked as uncompleted'});
                
    });
}

/**
 * This function updates any details about the project.
 * @param {HTTP Request} req Request body - ID of project, porject's name, due date of project, time spent on project, 
 * hourly rate of project and start date of project
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.update = (req, res) => {

    ProjectModel.findOne({ _id: req.body.projectID},(err, result) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if(!result)
            return res.status(404).json({message: 'Project not found'});
        else
        {
            if(req.body.hasOwnProperty('projectName'))
                 result.ProjectName = req.body.projectName;

            if(req.body.hasOwnProperty('timeSpent'))
                result.TimeSpent =  req.body.timeSpent;

            if(req.body.hasOwnProperty('dueDate'))
                result.DueDate =  req.body.dueDate;

            if(req.body.hasOwnProperty('hourlyRate'))
                result.HourlyRate =  req.body.hourlyRate;

            if(req.body.hasOwnProperty('startDate'))
                result.StartDate =  req.body.startDate;

        
                ProjectModel.updateOne({ _id: req.body.projectID},{ProjectName: result.ProjectName,TimeSpent:result.TimeSpent,
                DueDate : result.DueDate, HourlyRate: result.HourlyRate, StartDate: result.StartDate},(err, result) => {
                    if (err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else
                        return res.status(200).json({message: 'Project successfully updated'});
                
                });
           
        }
    });
}

/**
 * This function receives project details (ensure person adding is a authenticated user) and adds that project to the organisation.
 * @param {HTTP Request} req Request body - Project's name, due date of project, hourly rate of project and start date of project and due date of project.
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.add = (req, res, next) => {

    var project = new ProjectModel();
    project.ProjectName = req.body.projectName;
    project.TimeSpent = 0;
    project.DueDate = req.body.dueDate;
    project.StartDate = req.body.startDate;
    project.Completed = false;
    project.HourlyRate = req.body.hourlyRate;
    project.TeamLeader = req.ID;
    project.TeamMembers.push({ _id : project.TeamLeader, Role: "Team Leader"});
    project.save((err, doc) => {
        if(!err){
            req.ProjectID = doc._id;
            req.body.userID = req.ID;
            next();
            //return res.status(200).json({ projectID : doc._id, message: 'Project Created' });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: 666' + err});
        }
    })
}

/**
 * This function adds a new task to the project.
 * @param {HTTP Request} req Request body - ID of project
 * @param {HTTP Response} res 
 * @returns {String} Task ID or error message.
 */
module.exports.addTask = (req, res) => {
    if(!req.body.projectID)
        return res.status(400).send({message: 'No project ID provided'});

        ProjectModel.updateOne({_id : req.body.projectID}, { $push: { Tasks: req.TaskID } },function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});

        else if (!result)
            return res.status(404).send({message: "Project not found"});

        else 
            return res.status(200).json({ taskID: req.TaskID, message: 'Task created and added to project' });
              
           
    });

}

/**
 * This function deletes the project, and all the tasks associated with the project and the team working on the project.
 * @param {HTTP Request} req Request query - ID of project.
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.deleteProject = (req, res) => { 
    if(!req.query.projectID)
        return res.status(400).send({message: 'No project ID provided'});
    ProjectModel.findOne({_id: req.query.projectID},(err,val)=>{
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!val) 
            return res.status(404).json({ message: 'Project not found' });
        else 
        {
            TaskHelper.deleteTask(val.Tasks,(err,result)=>
            {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else
                {
                    
                    ids= [];
                    for(a=0; a<val.TeamMembers.length; a++)
                    {
                        ids.push(val.TeamMembers[a]._id);
                    }
                    UserHelper.deleteProject(ids,req.query.projectID, (err,result)=>
                    {
                        if(err)
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        else
                        {
                            ProjectModel.deleteOne({_id: req.query.projectID},(err,val)=>{
                                if(err)
                                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            
                                else 
                                {    
                                    return res.status(200).json({ message: 'Project successfully deleted '});
                                }
                            });   
                        }
                
                    });
                }
            });   
        }    
    });
}

/**
 * 
 * @param {HTTP Request} req Request query - ID of project and task.
 * @param {HTTP Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.deleteTask = (req, res, next) => {  
    if(!req.query.projectID)
        return res.status(400).send({message: 'No project ID provided'});
    ProjectModel.updateOne({_id: req.query.projectID},{ $pull: { 'Tasks':   req.query.taskID}},(err,val)=>{
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!val) 
            return res.status(404).json({ message: 'Project not found' });
        else 
        {
              next();  
        }    
        
    });
}

/**
 * This function changes the status of the project to complete.
 * @param {HTTP Request} req Request body - ID of project.
 * @param {HTTP Response} res 
 * @returns {String} Project ID or error message.
 */
module.exports.complete = (req, res) => {
    ProjectModel.updateOne({_id : req.body.projectID}, {Completed: true},(err, result)=> {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
             return res.status(404).send({message: "Project not found"});
        else 
            return res.status(200).json({ projectID: req.body.ProjectID, message: 'Project marked as completed' });
    });
}

/**
 * This function assigns a team to a project.
 * @param {HTTP Request} req HTTP-  TeamID, ProjectID
 * @param {HTTP Response} res 
 * @returns {JSON Array} success or error message, ProjectID and TeamID.
 */
module.exports.addTeam = (req, res) => {
    if(!req.body.projectID)
        return res.status(400).send({message: 'No project ID provided'});
    
    if(!req.body.teamID)
        return res.status(400).send({message: 'No team ID provided'});

    ProjectModel.findOne({_id : req.body.projectID}, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Project not found'});
        else
        {
            TeamHelper.getTeamMembers( req.body.teamID,(err,val)=>
            {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});

                else if(val == false) 
                    return res.status(404).json({ message: 'Team not found' });
                else 
                {
                    ids= [];
                    for(i=0; i<val.length; i++)
                    {
                        if( !result.TeamMembers.some(member => member._id.equals(val[i]._id )))
                        {
                            result.TeamMembers.push(val[i]);
                            ids.push(val[i]._id);
                        }
                    }
                    UserHelper.addProject(ids, req.body.projectID, (err, val)=>
                    {
                        if(err) 
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        else
                        {
                            ProjectModel.updateOne({_id : req.body.projectID},{TeamMembers:result.TeamMembers }, function(err, result) {
                                if(err) 
                                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                                else if (!result)
                                    return res.status(404).send({message: 'Project not found'});
                                else
                                    return res.status(200).send({message: 'Team successfully added to project'});
                                
                            });
                        }
                    });
                }
            });
        }
        
    });


}

/**
 * This function clears the team of a project.
 * @param {HTTP Request} req HTTP-  TeamID, ProjectID
 * @param {HTTP Response} res 
 * @returns {JSON Array} success or error message, ProjectID and TeamID.
 */
module.exports.removeTeam = (req, res) => {
    if(!req.body.projectID)
        return res.status(400).send({message: 'No project ID provided'});

    ProjectModel.findOne({_id : req.body.projectID}, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Project not found'});
        else
        {
            ids =[]; 
            clear= [];
            for(i=0; i<result.TeamMembers.length; i++)
            {
                ids.push(result.TeamMembers[i]._id);
            }
            UserHelper.deleteProject(ids, req.body.projectID, (err, result)=>
            {
                if(err) 
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else
                {
                    ProjectModel.updateOne({_id : req.body.projectID},{TeamMembers:clear }, function(err, result) {
                        if(err) 
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        else if (!result)
                            return res.status(404).send({message: 'Project not found'});
                        else
                            return res.status(200).send({message: 'All members removed from project'});
                        
                    });
                }
            });
        }
        
    });
}

/**
 * This function adds a member to a project.
 * @param {HTTP Request} req HTTP Body - The project ID, the new Team Member's ID, and their role in the team.
 * @param {HTTP Response} res 
 * @param {Function} next - The next function to be called 
 */
module.exports.addMember = (req, res, next) => {
    if(!req.body.hasOwnProperty('userID'))
        return res.status(400).send({message: 'No user ID given'});

    if(!req.body.hasOwnProperty('projectID'))
        return res.status(400).send({message: 'No project ID given'});

    if(!req.body.hasOwnProperty('userRole'))
        return res.status(400).send({message: 'No user role given'});

    ProjectModel.updateOne({_id : req.body.projectID },{ $addToSet: { TeamMembers: { _id: req.body.userID, Role: req.body.userRole } } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Project not found'});
        else {
            next();
            //return res.status(200).json({ message: 'Member added successfully', "TeamID": result._id });     
        }
    });
}
/**
 * This function removes a member from a project.
 * @param {HTTP Request} req Request body - ID of user and project.
 * @param {Http Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.removeMember = (req, res, next) => {
    if(!req.body.hasOwnProperty('userID'))
        return res.status(400).send({message: 'No user ID given'});

    if(!req.body.hasOwnProperty('projectID'))
        return res.status(400).send({message: 'No project ID given'});

    ProjectModel.updateOne({_id : req.body.projectID },{ $pull: { TeamMembers: { _id: req.body.userID} } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Project not found'});
        else {
            next();
        }
    });
}

/**
 * Update role of user for a project
 * @param {HTTP Request} req Request body - ID of user, project and new role.
 * @param {HTTP Response} res 
 * @return {String} Error or success message.
 */

module.exports.addRole = (req, res) => {  
    if(!req.body.projectID)
        return res.status(400).send({message: 'No project ID provided'});
    
    if(!req.body.userID)
        return res.status(400).send({message: 'No user ID provided'});

    if(!req.body.userRole)
        return res.status(400).send({message: 'No user role provided'});

    ProjectModel.updateOne({_id : (req.body.projectID)},{ $pull: { TeamMembers: { _id: req.body.userID} } },function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Project not found'});
        else {
            ProjectModel.updateOne({_id : (req.body.projectID)},{ $push: { TeamMembers: { _id: req.body.userID,  Role: req.body.userRole} } },function(err, result) {
                if(err) 
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else 
                    return res.status(200).json({ projectID: req.body.projectID, message: 'Member role updated successfully'});     

           });
        }
    });   
}
