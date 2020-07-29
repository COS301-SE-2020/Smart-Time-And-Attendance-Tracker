/**
  * @file organisationTeam.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles all the requests regarding organisationTeam model in our database
  * @date 28 June 2020
 */

/**
* Filename:             organisationTeam.cotroller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   28 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding organisationTeam model in our database
*
*/ 
const mongoose = require("mongoose");
const TeamModel = mongoose.model("teams");
const ProjectHelper =  require('../helpers/project.helper');
const UserHelper =  require('../helpers/user.helper');


const UserModel = mongoose.model("User");
/**
 * This function creates a Organisation Team.
 * @param {*} req 
 * @param {*} res 
 * @return {String} Error or succes message.
 */
module.exports.createTeam = (req, res) => {
    //console.log(req.body)
    var team = new TeamModel();
    team.TeamName = req.body.TeamName;
    team.TeamMembers.push({ _id : req.ID, Role: "Team Leader"});
    UserModel.findOne({ _id: req.ID }, function(err, cons){
        if (err) return res.status(500).send({message: 'Internal Server Error1: ' + err});
        if (cons){
            team.TeamLeader =cons;

            console.log(team);
            team.save((err, doc) => {
                if(!err){
                    req.teamID = doc._id;
                    UserHelper.addTeam(req.ID, doc._id,(err,val)=>
                    {
                        if(err)
                           return res.status(500).send({message: 'Internal Server Error55: ' + err});
        
                        else if(val == false) 
                           return res.status(404).json({ message: 'User not found' });
                        else 
                            return res.status(200).json({ message: 'Team Created'+ doc}); 
                   });
                }
                else{
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                }
            })

        }
    })
}


/**
 * This function receives a TeamID, a UserID and the user Role and adds the user to the team
 */

module.exports.addTeamMember = (req, res, next) => {
     console.log(req.body)
    TeamModel.updateOne({_id : (req.body.TeamID)},{ $push: { TeamMembers: { _id: req.body.UserID, Role: req.body.UserRole } } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else {
           // req.TeamID = result._id;
            next();
            return res.status(200).json({ message: 'Member added successfully', "TeamID": result });     
        }
    });
}

/**
 *   receives TeamID, UserID and deletes user from the team
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

module.exports.remove = (req, res, next) => {
    console.log(req.body)
    TeamModel.updateOne({_id : (req.body.TeamID)},{ $pull: { TeamMembers: { _id: req.body.UserID} } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else {
            next();
            return res.status(200).json({ message: 'Member deleted successfully', "TeamID": result });     
        }
    });   
}





/**
 * Receives TeamID , UserID and UserRole
 * then updates users role - 
 * to optimize - delete user, then adds again with new role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

module.exports.addRole = (req, res, next) => {  / ////optimize
    console.log(req.body)
    TeamModel.updateOne({_id : (req.body.TeamID)},{ $pull: { TeamMembers: { _id: req.body.UserID} } },function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else {
           // next();
           TeamModel.updateOne({_id : (req.body.TeamID)},{ $push: { TeamMembers: { _id: req.body.UserID,  Role: req.body.UserRole} } },function(err, result) {
                    if(err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else if (!result)
                        return res.status(404).send({message: 'Team not found'});
                    else {
                        return res.status(200).json({ message: 'Member role updated successfully', "TeamID": result });     
                    }
           })
        }
    });   
}