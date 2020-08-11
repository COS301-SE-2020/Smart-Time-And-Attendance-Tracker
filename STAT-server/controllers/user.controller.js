/**
  * @file STAT-server/controllers/user.controller.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file handles all the requests regarding the User model in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/controllers/user.controller.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file handles all the requests regarding the User model in our database
*
*/ 

const mongoose = require("mongoose");
const passport = require("passport");
const UserModel = mongoose.model("User");

const RoleHelper =require('../helpers/role.helper');
const TeamHelper =require('../helpers/team.helper');
const ProjectHelper =require('../helpers/project.helper');

//const request = require('request');
/**
 * This function is called when a user login's into the STAT. 
 * This function does all the validation the user's email and password, then returns a uniquely
 * generated token to the user.
 * @param req - HTTP request 
 * @param res HTTP response 
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
 * This function is called when a user registers to STAT. 
 * This function does all the validation, and inserts the user into the database.
 * @param {*} req HTTP request 
 * @param {*} res HTTP response 
 * @return {Http Response} - If registration is a success a token is returned, otherwise an error message is returned
 */
module.exports.register = (req, res) => {
    if(!( req.body.name &&  req.body.surname && req.body.email && req.body.password && req.body.passwordConf)) 
    {
        return res.status(400).send({message: "Missing credentials"});
    }
    else if (req.body.password !== req.body.passwordConf) { //pass=passconfirm
        return res.status(400).send({message: "Passwords do not match"});
    }
    else{
            UserModel.findOne({ Email: req.body.email }, function(err, cons) { //check email duplicates
                if (err) return res.status(500).send({message: 'Internal Server Error: ' + err});

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
                    user.ProfilePicture = "none";
                    user.save((err, doc) => {
                        if(!err)
                            return res.status(201).json({token: user.generateJWT(), message :"Sign up successful"});
                        else 
                        {
                            if (err.code == 11000)
                                res.status(409).send({message: 'User already exists'});
                            else
                                return res.status(500).send({message: 'Internal Server Error: ' + err});
                        }
                    });
    
                }
    
            });
    }
}

/**
 * This function allows the user to change password.
 * @param {*} req HTTP request 
 * @param {*} res HTTP response 
 * @return {Http Response} - If changing password is a success a success message is returned, otherwise a error message is returned
 
module.exports.changePass = (req, res, next) => {
    UserModel.updateOne({ _id: req.ID},{Password: req.body.pass},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
            return res.status(200).json({message: 'Password changed'});
               
    });
   
} */  

/**
 * This function returns the name and surname of the user.
 * @param {*} req HTTP request 
 * @param {*} res HTTP response 
 * @return {Http Response} - Returns name and surname of the user if no error occured in 
 * fecthing the user's details from the database.
 */
module.exports.getName = (req, res, next) => {
    UserModel.findOne({ _id: req.ID},{Name: 1, Surname: 1},(err, result) => {
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
 * @param {*} req HTTP request 
 * @param {*} res HTTP response 
 * @return {Http Response} - Returns roles pf the user if no error occured, otherwise an error message is returned.
 */
module.exports.getRoles = (req, res) => {
    UserModel.findOne({ _id: req.ID},{Role: 1},(err, result) => {
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

 * @param {*} req HTTP request 
 * @param {*} res HTTP response 
 * @return {Http Response} - Array with all unauthenticated users objects
 */
module.exports.getUnauthenticatedUsers = (req, res) => {
    UserModel.find({ Authenticate : false},{_id: 1, Name: 1, Surname: 1, Email: 1, ProfilePicture: 1},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No unauthenticated users found' }); 
        else
        {
            UnauthenticatedUsers=[];
            for(var a=0; a<result.length; a++){
                UnauthenticatedUsers.push({ID : result[a]._id, email : result[a].Email, name : result[a].Name, surname : result[a].Surname, profilePicture: user.ProfilePicture});
            }
            return res.status(200).json({unauthenticatedUsers: UnauthenticatedUsers});
        }
    });
}

/**
 * This function returns an array with all authenticated users objects
 * Only a security admin can make this request.
 * @param {*} req HTTP request 
 * @param {*} res HTTP response 
 * @return {Http Response} - Array with all authenticated users objects
 */
module.exports.getAllUsers = (req, res) => {
    UserModel.find({ Authenticate : true},{_id: 1, Name: 1, Surname: 1, Email: 1, ProfilePicture: 1, Role:1},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'No users found' }); 
        else
        {
            users=[];
            for(var a=0; a<result.length; a++)
            {
                RoleHelper.getRoles(result[a],(err,val,user)=>
                {
                    if(err)
                        return res.status(500).send({message: 'Internal Server Error: ' + err});

                    else
                        users.push({'ID' : user._id, 'email' : user.Email, 'name' : user.Name, 'surname' : user.Surname, 'profilePicture': user.ProfilePicture, 'role':val});
                    
                    if(users.length == result.length)
                            return res.status(200).json({users});
                    
            
                });
             
            }
        }
    });
}

/**
 * This function authenticates a user. Only a security admin can make this request.
 * @param req Request body - ID of user to authenticate
 * @param res Http Response
 * @return {Http Response} - Success or error message
 */
module.exports.authenticate = (req, res, next) => {
    if(!req.body.hasOwnProperty('userID'))
        return res.status(400).send({message: 'No user ID given'});

    UserModel.updateOne({ _id: req.body.userID},{Authenticate: true},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
            return res.status(200).json({message: 'User authenticated'});
               
    });
}

/**
 * This function removes a project from the user. Only a team lead can make this request
 * @param {HTTP Request} req Request body - ID of user and project 
 * @param {Http Response} res 
 * @returns {String} Success or error message.
**/
module.exports.removeProject = (req, res) => {

    UserModel.updateOne({_id : (req.body.userID)},{ $pull: {Projects : req.body.projectID } }, function(err, result) {                
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
            return res.status(200).json({message: 'User successfully removed from project'});
               
    });
}

/**
 * This function adds a project to the user. Only a team lead can make this request.
 * @param req Request body - ID of user and project ID
 * @param res Http Response
 * @return {Http Response} - Success message with project ID or error message
 */
module.exports.addProject = (req, res, next) => {
    UserModel.updateOne({_id : req.body.userID},{ $addToSet: { Projects: req.body.projectID} }, (err, result) =>{   
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else;
            return res.status(200).json({ projectID: req.body.projectID, message: 'User successfully added to project' });
    });
}

/**
 * This function removes(deletes) a user from the organisation. 
 * Only a security admin can make this request.
 * @param {HTTP Request} req Request body - ID of user to remove/reject
 * @param {HTTP Response} res 
 * @return {Http Response} - Succes or error message
 */
module.exports.remove = (req, res, next) => {
    if(!req.body.hasOwnProperty('userID'))
        return res.status(400).send({message: 'No user ID given'});

    UserModel.findOne({ _id: req.body.userID},{Projects: 1},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
        {
            //remove user from 'project' teams
            ProjectHelper.removeUser(req.body.userID, result.Projects,(err)=>
            {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else
                {
                    TeamHelper.removeUser(req.body.userID,(err)=>
                    {
                        if(err)
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        else
                        {
                            UserModel.deleteOne({ _id: req.body.userID},(err, result) => {
                                if (err) 
                                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                                else
                                    return res.status(200).json({message: 'User removed'});
                            });
                        }
                    });

                }
            });
        }
               
    });
}

/**
 * This function checks if the user is authenticated
 * @param {HTTP Request} req Request - ID of user
 * @param {HTTP Response} res 
 */
module.exports.isAuthenticated = (req, res) => {
    UserModel.findOne({ _id: req.ID},{Authenticate: 1},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        else
            return res.status(200).json({ authenticated: result.Authenticate});
        
    });
  
}

/**
 * This function gets all the projects (and associated details) a user is working on.
 * @param {HTTP Request} req Request - ID of user.
 * @param {HTTP Response} res 
 * @return {Http Response} - Array with all projects and tasks objects
 */
module.exports.getProjects = (req, res) => {
    let count = 0;
    let projectsOfUser = [];
    UserModel.findOne({ _id: req.ID},{Projects: 1},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Projects.length == 0)
                return res.status(404).json({ message: 'User is not assigned to any projects' });

            for(i=0; i<result.Projects.length; i++)
            {      
                ProjectHelper.getTasks(result.Projects[i],(err,val)=> {
                    count = count +1;
                    if(err)
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                   
                    else if(val)
                        projectsOfUser.push(val);

                    if(count == result.Projects.length)
                    {
                        return res.status(200).json({projects : projectsOfUser});
                    };
                }); 
                
            
            }
            
        }
    });
}
/**
 * This function edits a user from the organisation. 
 * Only a security admin can make this request.
 * @param req Request body - ID of user to edit
 * @param res Http Response
 * @return {Http Response} - Success or error message
 */
module.exports.edit = (req, res) => {
    UserModel.findOne({ _id: req.body.userID},{Name: 1, Surname: 1, Email: 1},(err, result) => {
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if(!result)
            return res.status(404).json({message: 'User not found'});
        else
        {
            if(req.body.hasOwnProperty('name'))
                 result.Name = req.body.name;

            if(req.body.hasOwnProperty('email'))
                result.Email =  req.body.email;

            if(req.body.hasOwnProperty('surname'))
                result.Surname =  req.body.surname;

        
                UserModel.updateOne({ _id: req.body.userID},{Name: result.Name,Email:result.Email, Surname : result.Surname},(err, result) => {
                    if (err) 
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else
                        return res.status(200).json({message: 'User successfully updated'});
                
                });
           
        }
    });
}


/**
 * This function receives userID and userRole, checks if the role is already added and if not it adds the role to the role array 
 * Only a security admin can make this request.
 * @param req Request body - ID of user to add role to
 * @param res Http Response
 * @return {Http Response} - Success or error message
 */

module.exports.addRole = (req, res) => {  

    if(!req.body.hasOwnProperty('userID'))
        return res.status(400).send({message: 'No user ID given'});

    if(!req.body.hasOwnProperty('userRole'))
        return res.status(400).send({message: 'No role given'});

    UserModel.findOne({ _id: req.body.userID},{Role:1},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        else
        {
            RoleHelper.getRoleID(req.body.userRole,(err,val)=>
            {
                    if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});

                else if(val == false) 
                    return res.status(404).json({ message: 'Role not found' });
                else 
                {
                    if( result.Role.includes(val)){
                        return res.status(200).json({message : "Role already exists"});
                     }
                    else
                    {
                        UserModel.updateOne({ _id: req.body.userID},{ $push: { Role: val } },
                            (err, result) => {
                            if (err) 
                                return res.status(500).send({message: 'Internal Server Error: ' + err});
                            else
                                return res.status(200).json({message : "Role successfully added"});
                        });
                    }
                }
            });

        }
    })


}       


/**
 * This function receives userID and userRole, checks if the role is already added and if it is, it removes the role to the role array 
 * Only a security admin can make this request.
 * @param req Request body - ID of user to add role to
 * @param res Http Response
 * @return {Http Response} - Success or error message
 */

module.exports.removeRole = (req, res) => {  

    if(!req.body.hasOwnProperty('userID'))
        return res.status(400).send({message: 'No user ID given'});

    if(!req.body.hasOwnProperty('userRole'))
        return res.status(400).send({message: 'No role given'});

    UserModel.findOne({ _id: req.body.userID},{Role:1},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        else
        {

            RoleHelper.getRoleID(req.body.userRole,(err,val)=>
            {
                if(err)
                return res.status(500).send({message: 'Internal Server Error: ' + err});

            else if(val == false) 
                return res.status(404).json({ message: 'Role not found' });
            else 
            {
                if( result.Role.includes(val))
                {
                    UserModel.updateOne({ _id: req.body.userID},{ $pull: { Role: val } },
                        (err, result) => {
                        if (err) 
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
                        else
                            return res.status(200).json({message : "Role successfully removed"});
                    });
                }
                else
                    return res.status(404).json({message : "User is not assigned this role"});
            }
            });
            
        }

    });

} 

