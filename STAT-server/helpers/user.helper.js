/**
  * @file STAT-server/helpers/user.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles some of the requests regarding User model in our database. 
  * This is a helper file to handle User related requests.
  * @date 2 July 2020
 */

/**
* Filename:             STAT-server/helpers/user.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   2 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles some of the requests regarding User model in our database. 
*                       This is a helper file to handle User related requests.
*
*/
const mongoose = require("mongoose");
const UserModel = mongoose.model("User");


/**
 * checks to see if user has a role of "Security Administrator".
 * @param {HTTP Request} req ID of user.
 * @param {HTTP Response} res  
 * @param {Function} next Next function to be called.
 */
module.exports.isSecurityAdmin = (req, res, next) => {

    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Role.includes(3))
                next();
            else
                return res.status(403).json({ message: "Access denied"});
        }
    });
    
}


/**
 * checks to see if user has a role of "Team Leader".
 * @param {HTTP Request} req ID of user.
 * @param {HTTP Response} res 
 * @param {Function} next Next function to be called.
 */
module.exports.isTeamLeader = (req, res, next) => {

    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Role.includes(4))
                next();
            else
                return res.status(403).json({ message: "Access denied"});
        }
    });  
}


/**
 * checks to see if user is authenticated.
 * @param {HTTP Request} req ID of User.
 * @param {HTTP Response} res 
 * @param {Function} next Next function to be called.
 */
module.exports.isAuthenticated = (req, res, next) => {

    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Authenticate == true)
                next();
            else
                return res.status(403).json({ message: "Not authenticated"});
        }
    });
  
}

/**
 * Add team ID to user.
 * @param {String} id ID of user.
 * @param {String} teamID ID of Team.
 * @param {*} done 
 */
module.exports.addTeam = (id, teamID, done) => {
    UserModel.updateOne({_id : id},{ $push: { Team: teamID } }, function(err, result) {
        if(err) 
            done(err);
        
        else if (!result)
            done(null, false);
     
        else
            done(null, true);
        
    });
}

/**
 * Deletes project from Projects array.
 * @param {*} ids 
 * @param {String} projectID 
 * @param {function} done - return to this funtion when done
 */
module.exports.deleteProject = (ids, projectID, done) => {
    if(ids.length == 1)
    {
        UserModel.updateOne({_id: ids[0]},{ $pull: { Projects: projectID}},(err, result) => {
            if (err) 
                done(err);
            else if (!result)
                done(null, false);
            else
                done(null, false);
            
        });
      
    }
    else
    {
        UserModel.updateMany({_id:{$in: ids}},{ $pull: { Projects: projectID}},(err, result) => {
            if (err) 
                done(err);
            else if (!result)
                done(null, false);
            else
                done(null, false);
            
        });
    }
    
}

/**
 * Adds project to Projects array.
 * @param {*} ids 
 * @param {String} projectID 
 * @param {function} done - return to this funtion when done
 */
module.exports.addProject = (ids, projectID, done) => {
    console.log(ids.length);
    console.log(projectID);
    if(ids.length == 1)
    {
        UserModel.updateOne({_id: ids[0]},{ $addToSet: { Projects: projectID}},(err, result) => {
            if (err) 
                done(err);
            else if (!result)
                done(null, false);
            else
                done(null, true);
            
        });
      
    }
    else
    {
        UserModel.updateMany({_id:{$in: ids}},{ $addToSet: { Projects: projectID}},(err, result) => {
            if (err) 
                done(err);
            else if (!result)
                done(null, false);
            else
                done(null, true);
            
        });
    }
    
}