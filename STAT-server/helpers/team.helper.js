/**
  * @file STAT-server/helper/team.helper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles some of the requests regarding Team model in our database. 
  * This is a helper file to handle Team related requests.
  * @date 15 July 2020
 */

/**
* Filename:             STAT-server/helper/team.helper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   15 July 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles some of the requests regarding Team model in our database. 
*                       This is a helper file to handle Team related requests.
*
*/
const mongoose = require("mongoose");
const TeamModel = mongoose.model("teams");
const ProjectHelper =require('../helpers/project.helper');

/**
 * 
 * @param {String} id ID of Team.
 * @param {*} done 
 * @returns {Object} Team document(object).
 */
module.exports.deleteTeam = (id, done) => {   
    var object;
    TeamModel.findOne({_id: id},(err,val)=>{
        if(err)
            done(err);
        else   
        {
            object =val;
            TeamModel.deleteOne({_id: id},(err,result)=>{
                if(err)
                    done(err);
                else   
                    done(null, object);
            });
        }
    });  
 }

 /**
  * 
  * @param {String} id ID of Team.
  * @param {*} done 
  * @returns {String} Project ID.
  */
/*module.exports.getTasksOfTeam = (id, done)=>{
    TeamModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if (!result.ProjectID)
            done(null,false);
        else if(result)
        {
            ProjectHelper.getTasks(result.ProjectID,(err,val)=> {
                if(err)
                    done(err);
                else if(val == false) 
                    done(null,false);
                else
                    done(null, val);   
            
            });
        }
           
        
    });
}*/

/**
  * @param {*} userID User ID to be removed.
  * @param {*} ids Array of Team IDs.
  * @param {*} done 
  */
 module.exports.removeUser = (userID, done)=>{
    TeamModel.updateMany({_id: {$in: ids}},{ $pull: { TeamMembers: {_id:userID}}},(err,val)=>{     
        if(err) 
            done(err);
        else
            done(null);
    });   
}
/**
 * This function removes a user from all teams they're in
 * @param {Array} userID ID of user
 * @param {String} ids IDs of projects
 * @param {Function} done 
 */
module.exports.removeUser = ( userID, done)=>{
    TeamModel.updateMany({},{$pull: { TeamMembers: { _id: userID} }},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
            done(null, true);
        
    });                    
        
}

/**
 * This function removes a user from all teams they're in
 * @param {Array} userID ID of user
 * @param {String} ids IDs of projects
 * @param {Function} done 
 */
module.exports.getTeamMembers = ( teamID, done)=>{
    TeamModel.findOne({_id :teamID},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
            done(null, result.TeamMembers);
        
    });                    
        
}