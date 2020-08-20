/**

  * @file STAT-server/controllers/team.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the Team model in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/controllers/team.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the Team model in our database
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
/*module.exports.assignProject = (req, res) => {
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
}*/
/**
 * This function edits a team.
 * @param {HTTP Request} req HTTP Request - Project ID.
 * @param {HTTP Response} res 
 * @return {String} Error or success message.
 */
module.exports.editTeam = (req, res, next) => {
    TeamModel.updateOne({_id : (req.body.teamID)},{ TeamName: req.body.teamName }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (result.n == 0)
            return res.status(404).send({message: 'Team not found'});
        else 
            return res.status(200).json({ teamID: result._id, message: 'Team name successfully edited' });   
    });
}


/**
 * This function creates a Team.
 * @param {HTTP Request} req HTTP Request - Project ID.
 * @param {HTTP Response} res 
 * @return {String} Error or success message.
 */
module.exports.createTeam = (req, res, next) => {
    if(!req.body.teamName)
        return res.status(400).send({message: 'No team name provided'});
    var team = new TeamModel();
    team.TeamName= req.body.teamName;
    /*var teamMembers = [];
    for(var i=0; i< req.body.teamMembers.length; i++)
        teamMembers.push(req.body.teamMembers[i]);
    team.TeamMembers = teamMembers;
    console.log( req.body.teamMembers.length);*/
    team.save((err, doc) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else
            return res.status(200).send({teamID :doc._id,  message: 'Team created'});
    });
}

/**
 * This function receives a TeamID, a UserID and the user Role and adds the user to the team
 * @param {HTTP Request} req Request body - ID of user and Team.
 * @param {Http Response} res 
 * @return {String} Error or success message.
 */
module.exports.addTeamMember = (req, res, next) => {
    if(!req.body.teamID)
        return res.status(400).send({message: 'No team ID provided'});
        
    if(!req.body.userID)
        return res.status(400).send({message: 'No user ID provided'});   

    if(!req.body.userRole)
        return res.status(400).send({message: 'No user role provided'});

    TeamModel.updateOne({_id : (req.body.teamID)},{ $addToSet: { TeamMembers: { _id: req.body.userID, Role: req.body.userRole } } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (result.n == 0)
            return res.status(404).send({message: 'Team not found'});
        else 
            return res.status(200).json({ teamID: result._id, message: 'Member successfully added to team' });     
        
    });
}

/**
 * This function receives TeamID, UserID and deletes user from the team
 * @param {HTTP Request} req Request body - ID of user and team.
 * @param {HTTP Response} res 
 * @return {String} Error or success message.
 */

module.exports.removeTeamMember = (req, res) => {
     if(!req.body.teamID)
        return res.status(400).send({message: 'No team ID provided'});
        
    if(!req.body.userID)
        return res.status(400).send({message: 'No user ID provided'});

    TeamModel.updateOne({_id : (req.body.teamID)},{ $pull: { TeamMembers: { _id: req.body.userID} } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (result.n == 0)
            return res.status(404).send({message: 'Team not found'});
        else 
            return res.status(200).json({ teamID: result._id, message: 'Member successfully removed from team' });   
    });   
}


/**
 * Receives TeamID , UserID and UserRole
 * then updates users role - 
 * to optimize - delete user, then adds again with new role
 * @param {HTTP Request} req Request body - ID of user, team and new role.
 * @param {HTTP Response} res 
 * @return {String} Error or success message.
 */

module.exports.addRole = (req, res) => {  / ////optimize
    if(!req.body.teamID)
        return res.status(400).send({message: 'No team ID provided'});
    
    if(!req.body.userID)
        return res.status(400).send({message: 'No user ID provided'});

    if(!req.body.userRole)
        return res.status(400).send({message: 'No user role provided'});
        

    TeamModel.updateOne({_id : (req.body.teamID)},{ $pull: { TeamMembers: { _id: req.body.userID} } },function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (result.n == 0)
            return res.status(404).send({message: 'Team not found'});
        else {
           TeamModel.updateOne({_id : (req.body.teamID)},{ $push: { TeamMembers: { _id: req.body.userID,  Role: req.body.userRole} } },function(err, result) {
                if(err) 
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else 
                    return res.status(200).json({ teamID: req.body.teamID, message: 'Member role updated successfully'});     

           });
        }
    });   
}


/**
 * Receives TeamID and deletes the corresponding team.
 * @param {HTTP Request} req Request parameter - team ID 
 * @param {HTTP Response} res 
 * @return {String} Error or success message.
 */
module.exports.deleteTeam = (req, res) => {
    if(!req.query.teamID)
       return res.status(400).send({message: 'No team ID provided'}); 
   
   TeamModel.deleteOne({_id: req.query.teamID},(err,val)=>{
    if(err)
        return res.status(500).send({message: 'Internal Server Error: ' + err});
    else if (val.n == 0) 
        return res.status(404).json({ message: 'Team not found' });
    else 
        return res.status(200).json({ message: 'Team successfully deleted ' });
    });
}



/**
 * returns all teams as
  teams : [
       {
           ID:
           TeamName:
           TeamMembers: []
       },
        {
           ID:
           TeamName:
           TeamMembers: []
       }
  ]
 */

/**
 * Returns all teams in the team collection
 * @param {HTTP Request} req 
 * @param {HTTP Response} res 
 * @return {String} Array with teams and appropriate details
 */

module.exports.getTeams = (req, res) => {
    const allTeams =[];

    TeamModel.find({},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'Team collection not found' });
        
        else
        {
            if(result.length == 0)
                return res.status(404).json({ message: 'No teams found' });

            else
            {
                for(a=0; a<result.length; a++) ///result array with team objects
                {    
                    UserHelper.getTeamUserDetails(result[a], (err,val,team)=> {
                        if(err)
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        else 
                        {
                            var teamDetails ={"ID": team._id, "teamName": team.TeamName, "teamMembers" : val};
                            allTeams.push(teamDetails);
                        } 
            
                        if(allTeams.length == result.length)
                            return res.status(200).json({teams : allTeams });
                        
                    });
                }
                if(allTeams.length == result.length )
                    return res.status(200).json({teams : allTeams });
            }
        
        }
    });
}






