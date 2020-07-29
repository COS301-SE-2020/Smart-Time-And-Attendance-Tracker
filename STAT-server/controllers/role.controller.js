/**
  * @file STAT-server\controllers\role.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles all the requests regarding Role model in our database
  * @date 19 June 2020
 */

/**
* Filename:             STAT-server\controllers\role.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   19 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding Role model in our database
*
*/ 
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
   /* request({
        method: 'POST',
        url: 'http://127.0.0.1:3000' + '/api/user/getRoles',
        body: {
        token: req.body.token
       },
       json: true
       }, (error, response, body) => {
        if (error) {
            return res.status(500).json({message: "Internal Server Error"});

        }
        else if(response.statusCode == 200 && body.authenticate == false)
        {
            return res.status(401).json({message: "Unauthenticate user"});
        }
        else if(response.statusCode == 200 && response.body.roles.includes("Security Administrator"))
        {*/
            RoleModel.find({}, function(err, allDocuments) {
                if(err) return res.status(500).json({message: 'Internal Server Error: ' + error});
                var currentID = (allDocuments[0].ID) + 1;          
                var role = new RoleModel();
                role.ID = currentID;
                role.Role = req.body.role;
                role.updateOne((err, doc) => {
                    if(!err)
                        return res.status(201).json({ message: "Role created"});
                    
                    else{
                        if (err.code == 11000){
                            return res.status(409).json({message: "Role already exists"});
                        }
                        else{
                            return next(err);
                        }
                    }
                })
            }).sort({ ID: -1 });    //sorting all documents in descinding order of ID
        }
        /*else if(response.statusCode == 200 && !response.body.roles.includes("Security Administrator")) {
            return res.status(403).json({message: "Access forbidden"});
        }*/
    //});        


/**
 * This function gets a role of the given ID.
 * @param {HTTP Request} req Request body - ID of role
 * @param {HTTP Response} res 
 * @returns {String} error message or role.
 */
module.exports.getRole = (req, res) => {
    RoleModel.findOne({ ID: req.body.ID},(err, result) => {
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

