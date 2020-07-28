/**
  * @file STAT-server/config/jwtHelper.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file verifies the JWT token passed with each API request
  * @date 14 June 2020
 */

/**
* Filename:             STAT-server/config/jwtHelper.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   14 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file verifies the JWT token passed with each API request
*
*/

const jwt = require("jsonwebtoken");

module.exports.verifyJWTtoken = (req, res, next)=>
{
    var token;
    if('authorization' in req.headers)
        token = req.headers["authorization"].split(' ')[1];
    if(!token)
        return res.status(403).send({ message: "No token provided"});
    else{
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded)=> {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else{
                    req.ID = decoded.id;
                    //req.Authenticate = decoded.authenticate;
                    //req.Roles = decoded.roles;
                    next();
                }
            })
    }

}