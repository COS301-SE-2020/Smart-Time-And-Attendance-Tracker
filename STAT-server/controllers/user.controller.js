/**
  * @file user.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse
  * @fileoverview This file handles all the requests regarding User model in our database
  * @date 11June 2020
 */

/**
* Filename:             user.cotroller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse 
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding User model in our database
*
*/ 

const mongoose = require("mongoose");
const passport = require("passport");
const UserModel = mongoose.model("User");

const RoleHelper =require('../helpers/role.helper');
const TeamHelper =require('../helpers/team.helper');

//const request = require('request');
/**
 * This function is called when a user login's into the STAT. 
 * This function does all the validation the user's email and password, then returns a uniquely
 * generated token to the user.
 * @param req - HTTP request 
 * @param res Http response 
 * @return {Http Response} - If login is a success a token is returned, otherwise a error message is returned
 */
module.exports.login = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err,user,info)=>{
        //error from passport
        if(err)
            return res.status(500).json({message: 'Internal Server Error: ' + err});
        //registered user
        else if(user) 
        {
            return res.status(200).json({token: user.generateJWT(), message :"Sign in successful"});
        }
        //unknown user or wrong password
        else
        {
            if(info.message == 'Missing credentials')
                return res.status(400).json(info);

            return res.status(404).json(info);
        }
            
    })(req,res);

}

/**
 * This function is called when a user registers's into the STAT. 
 * This function does all the validation, and inserts user into database.
 * @param {*} req 
 * @param {*} res 
 * @return {Http Response} - If registration is a success a token is returned, otherwise a error message is returned
 */
module.exports.register = (req, res, next) => {
    if(!( req.body.name &&  req.body.surname && req.body.email && req.body.password && req.body.passwordConf)) 
    {
        return res.status(400).send({message: "Missing credentials"});
    }
    else if (req.body.password !== req.body.passwordConf) { //pass=passconfirm
        return res.status(400).send({message: "Passwords do not match"});
    }
    else{
            UserModel.findOne({ Email: req.body.email }, function(err, cons) { //check email duplicates
                if (err) return res.status(500).send({message: 'Internal Server Error1: ' + err});

                if (cons){
                    return res.status(409).send({message: 'User already exists'});
                }
                else{
                    var user = new UserModel();
                    user.Name = req.body.name;
                    user.Surname = req.body.surname;
                    user.Email = req.body.email.toLowerCase();
                    user.Password = req.body.password;
                    user.Role = [5]; 
                    user.Authenticate = false; 
                    user.save((err, doc) => {
                        if(!err)
                            return res.status(201).json({token: user.generateJWT(), message :"Sign up successful"});
                        else 
                        {
                            if (err.code == 11000)
                                res.status(409).send({message: 'User already exists'});
                            else
                                return res.status(500).send({message: 'Internal Server Error2: ' + err});
                        }
                    });
    
                }
    
            });
    }
}

/**
 * This function allows the user to change password.
 * @param {*} req 
 * @param {*} res 
 * @return {Http Response} - If changing password is a success a success message is returned, otherwise a error message is returned
 */
module.exports.changePass = (req, res, next) => {
    UserModel.updateOne({ _id: req.ID},{Password: req.body.pass},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
            return res.status(200).json({message: 'Password changed'});
               
    });
   
}   

/**
 * This function returns the name and surname of the user.
 * @param {*} req 
 * @param {*} res 
 * @return {Http Response} - Returns name and surname of the user if no error occured in 
 * fecthing the user's details from the database.
 */
module.exports.getName = (req, res, next) => {
    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        else
            return res.status(200).json({name : result.Name, surname : result.Surname});
        
    });
}

/**
 * This function returns the roles of a user. 
 * @param {*} req 
 * @param {*} res 
 * @return {Http Response} - Returns roles pf the user if no error occured, otherwise an error message is returned.
 */
module.exports.getRoles = (req, res, next) => {
    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            var rolesOfUser = [];
            var i=0, done = false;
            for(i=0; i<result.Role.length; i++)
            {
                
                 RoleHelper.getRole(result.Role[i],(err,val)=>
                 {
                     if(err)
                        return res.status(500).send({message: 'Internal Server Error: ' + err});

                    else if(val == false) 
                        return res.status(404).json({ message: 'Role not found' });
                    else 
                    {
                        rolesOfUser.push(val);
                        if(rolesOfUser.length == result.Role.length)
                        {
                            return res.status(200).json({roles : rolesOfUser});
                        }
                    }
                });
            }  
        }
    });
    
}

/**
 * This function returns all unauthenticated users from the organisation.
 * @param {*} req 
 * @param {*} res 
 * @return {Http Response} - Array with all unauthenticated users objects
 */
module.exports.getUnauthenticatedUsers = (req, res, next) => {
    UserModel.find({  Authenticate : false},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No unauthenticated users found' }); 
        else
        {
            UnauthenticatedUsers=[];
            for(var a=0; a<result.length; a++){
                UnauthenticatedUsers.push({ID : result[a]._id, email : result[a].Email, name : result[a].Name, surname : result[a].Surname});
            }
            return res.status(200).json({unathenticatedUsers: UnauthenticatedUsers});
        }
    });
}

/**
 * This function returns an array with all authenticated users objects
 * Only a security admin can make this request.
 * @param {*} res 
 * @return {Http Response} - Array with all authenticated users objects
 */
module.exports.getAllUsers = (req, res, next) => {
    UserModel.find({  Authenticate : true},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No users found' }); 
        else
        {
            users=[];
            for(var a=0; a<result.length; a++){
                users.push({ID : result[a]._id, email : result[a].Email, name : result[a].Name, surname : result[a].Surname});
            }
            return res.status(200).json({users});
        }
    });
}

/**
 * This function authenticates a user. Only a security admin can make this request.
 * @param req Request body - ID of user to authenticate
 * @param res Http Response
 * @return {Http Response} - Succes or error message
 */
module.exports.authenticate = (req, res, next) => {
    UserModel.updateOne({ _id: req.body.UserID},{Authenticate: true},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
            return res.status(200).json({message: 'User authenticated'});
               
    });
}

/**
 * This function adds a team to the user. Only a team lead can make this request.
 * @param req Request body - ID of user and Team id
 * @param res Http Response
 * @return {Http Response} - Success message with team id or error message
 */
module.exports.addTeam = (req, res, next) => {
    UserModel.findOne({_id : req.body.userID}, function(err, result) {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result)
        {
            return res.status(404).send({message: 'User not found'});
        }
        else {
            result.Team.push(req.TeamID)
            result.updateOne((err, doc) => {
                if(!err)
                {
                    return res.status(200).json({ teamID: req.TeamID, message: 'User successfully added to team' });
                }
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            });
        }
    });
}

/**
 * This function removes(deletes) a user from the organisation. 
 * Only a security admin can make this request.
 * @param req Request body - ID of user to remove/reject
 * @param res Http Response
 * @return {Http Response} - Succes or error message
 */
module.exports.remove = (req, res, next) => {
    UserModel.deleteOne({ _id: req.body.userID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
            return res.status(200).json({message: 'User removed'});
               
    });
}

/**
 * This function checks if the user is authenticated
 * @param req Request - ID of user
 * @param res Http Response
 * @param next The next function to call
 * @return {Http Response} - Value of Authenticated attribute or an error message
 */
module.exports.isAuthenticated = (req, res, next) => {
    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        else
            return res.status(200).json({ authenticated: result.Authenticate});
        
    });
  
}

/**
 * This function gets all the tasks(with project) a user is working on.
 * @param req Request - ID of user.
 * @param res Http Response
 * @return {Http Response} - Array with all projects and tasks objects
 */
module.exports.getTasks = (req, res, next) => {
    let error = false;
    let count = 0;
    let projectsOfUser = [];
    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Team.length == 0)
                return res.status(404).json({ message: 'User is not assigned to a team' });
            for(i=0; i<result.Team.length; i++)
            {
                TeamHelper.getTasksOfTeam(result.Team[i],(err,val)=>
                 {
                    count = count + 1;
                    if(err)
                        return res.status(500).send({message: 'Internal Server Error: ' + err});

                    else if(val)
                    {
                        
                        projectsOfUser.push(val);
                        if(count == result.Team.length)
                        {
                            return res.status(200).json({projects : projectsOfUser});
                        }
                    }
                    else
                    {
               
                        if(count == result.Team.length)
                        {
                            if(projectsOfUser.length == 0)
                                return res.status(404).json({ message:  'No projects found' });
                            else
                                return res.status(200).json({projects : projectsOfUser});
                        }
                    }
                });
            }
            
        }
    });
}

