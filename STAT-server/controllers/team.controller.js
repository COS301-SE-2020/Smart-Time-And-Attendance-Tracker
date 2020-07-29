/**
  * @file STAT-server\controllers\team.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles all the requests regarding Team model in our database
  * @date 19 June 2020
 */

/**
* Filename:             STAT-server\controllers\team.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   19 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding Team model in our database
*
*/ 
const mongoose = require("mongoose");
const TeamModel = mongoose.model("teams");
const ProjectHelper =  require('../helpers/project.helper');
const UserHelper =  require('../helpers/user.helper');

/**
 * This function assigns a project to a Team.
 * @param {HTTP Request} req HTTP-  TeamID, ProjectID
 * @param {HTTP Response} res 
 * @returns {JSON Array} success or error message, ProjectID and TeamID.
 */
module.exports.assignProject = (req, res) => {
    TeamModel.updateOne({_id : req.teamID},{ProjectID:req.ProjectID }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else
        {
            
        ProjectHelper.addTeam(req.ProjectID, req.teamID,(err,val)=>
        {
            if(err)
                return res.status(500).send({message: 'Internal Server Error: ' + err});

            else if(val == false) 
                return res.status(404).json({ message: 'Project not found' });
            else 
            {
                return res.status(200).json({projectID: req.ProjectID,teamID: req.teamID, message: 'Project successfully added to team'});
            }
        });
        }  
    });
}

/**

 * This function adds a member to a Team.
 * @param {HTTP Request} req HTTP Body - TeamID, new Team Member's ID, and their role in the team.
 * @param {HTTP Response} res 
 * @param {Function} next - The next function to be called 
 */
module.exports.addTeamMember = (req, res, next) => {
    TeamModel.updateOne({_id : req.body.TeamID },{ $push: { TeamMembers: { _id: req.body.UserID, Role: req.body.UserRole } } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else {
            next();
            //return res.status(200).json({ message: 'Member added successfully', "TeamID": result._id });     
        }
    });
}
/**
 * 
 * @param {HTTP Request} req Request body - ID of user and Team.
 * @param {Http Response} res 
 * @param {Function} next The next function to be called.
 */
module.exports.removeTeamMember = (req, res, next) => {
        TeamModel.updateOne({_id : req.body.TeamID },{ $pull: { TeamMembers: { _id: req.body.UserID} } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else {
            next();
        }
    });
}

/**
 * This function creates a Team and adds the Team Leader(the member that creates the Team) to the team members of the Team.
 * @param {HTTP Request} req HTTP Request - Project ID and User ID (the team leader).
 * @param {HTTP Response} res 
 * @param {Function} next next function to be called 
 */
module.exports.createTeam = (req, res, next) => {
    var team = new TeamModel();
    team.TeamLeader = req.ID;
    team.ProjectID = req.ProjectID;
    /*var teamMembers = [];
    for(var i=0; i< req.body.teamMembers.length; i++)
        teamMembers.push(req.body.teamMembers[i]);
    team.TeamMembers = teamMembers;
    console.log( req.body.teamMembers.length);*/
    team.TeamMembers.push({ _id : team.TeamLeader, Role: "Team Leader"});
    team.save((err, doc) => {
        if(!err){
            req.teamID = doc._id;
            UserHelper.addTeam(team.TeamLeader, req.teamID,(err,val)=>
            {
                if(err)
                   return res.status(500).send({message: 'Internal Server Error55: ' + err});

               else if(val == false) 
                   return res.status(404).json({ message: 'User not found' });
               else 
                next(); 
                  
        
           });
            //req.body.projectID = req.ProjectID;
            //return res.status(200).json({ teamID : doc._id, message: 'Team Created' });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}


