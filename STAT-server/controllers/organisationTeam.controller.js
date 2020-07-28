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

/**
 * This function creates a Organisation Team.
 * @param {*} req 
 * @param {*} res 
 * @return {String} Error or succes message.
 */
module.exports.createTeam = (req, res) => {
    var team = new TeamModel();
    team.TeamName = req.body.TeamName;
    team.TeamMembers.push({ _id : req.ID, Role: "Team Leader"});
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
                    return res.status(200).json({ message: 'Team Created'}); 
           });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}


