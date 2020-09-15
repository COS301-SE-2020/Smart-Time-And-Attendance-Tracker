
/**
  * @file STAT-server/controllers/role.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the Role model in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/controllers/role.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the Role model in our database
*
**/

const mongoose = require("mongoose");
const RoleModel = mongoose.model("Role");
//var request = require('request');

/**
 * This function adds a new role to the organisation.
 * @param {HTTP Request} req Request body - new role.
 * @param {HTTP Response} res 
 * @returns {String} Success or error message.
 */
module.exports.add = (req, res) => {  
  
    RoleModel.find({}, function(err, allDocuments) {
        if(err) return res.status(500).json({message: 'Internal Server Error: ' + error});
        var currentID = (allDocuments[0].ID) + 1;          
        var role = new RoleModel();
        role.ID = currentID;
        role.Role = req.body.role;
        role.save((err, doc) => {
            if(!err)
                return res.status(201).json({ message: "Role created" ,role:doc});
            
            else{
                if (err.code == 11000){
                    return res.status(409).json({message: "Role already exists"});
                }
                else{
                    return res.status(409).json({message: err});///next(err);
                }
            }
        })
    }).sort({ ID: -1 });    //sorting all documents in descinding order of ID
}
       

/**
 * This function gets a role of the given ID.
 * @param {HTTP Request} req Request body - ID of role
 * @param {HTTP Response} res 
 * @returns {String} error message or role.
 */
module.exports.getRole = (req, res) => {

    RoleModel.findOne({ ID: req.query.ID},(err, result) => {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        }
        else if (!result)
        {
            return res.status(404).json({ message: 'Role record not found' });
        }
        else if (result)
        {
            return res.status(200).json({ role : result.Role});
        }
    });
}
