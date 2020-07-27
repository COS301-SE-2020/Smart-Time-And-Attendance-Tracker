/**
  * @file STAT-server/helper/user.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles some of the requests regarding User model in our database. 
  * This is a helper file to handle User related requests.
  * @date 2 July 2020
 */

/**
* Filename:             STAT-server/helper/user.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
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
 * @param {*} req ID of user.
 * @param {*} res 
 * @param {*} next 
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
 * @param {*} req ID of user.
 * @param {*} res 
 * @param {*} next 
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
 * @param {*} req ID of User.
 * @param {*} res 
 * @param {*} next 
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
 * @param {*} id ID of user.
 * @param {*} teamID ID of Team.
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
 * Deletes team from Team array.
 * @param {*} ids 
 * @param {*} teamID 
 * @param {*} done 
 */
module.exports.deleteTeam = (ids, teamID, done) => {

    UserModel.updateMany({_id:{$in: ids}},{ $pull: { Team: teamID}},(err, result) => {
        if (err) 
            done(err);
        else if (!result)
            done(null, false);
        else
            done(null, false);
        
    });
  
}