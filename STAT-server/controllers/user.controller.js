const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const UserModel = mongoose.model("User");

const RoleHelper =require('../helpers/role.helper');

//const request = require('request');

module.exports.login = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err,user,info)=>{
        //error from passport
        if(err)
            return res.status(500).json({message: 'Internal Server Error: ' + error});
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
                if (err) return res.status(500).send({message: 'Internal Server Error: ' + error});

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
                                return res.status(500).send({message: 'Internal Server Error: ' + error});
                        }
                    });
    
                }
    
            });
    }
}
    

module.exports.getName = (req, res, next) => {
    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        else
            return res.status(200).json({name : result.Name, surname : result.Surname});
        
    });
}


module.exports.getRoles = (req, res, next) => {
    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            var rolesOfUser = [];
            var i=0, done = false;
            for(i=0; i<result.Role.length; i++)
            {
                
                /*request({
                    method: 'POST',
                    url: 'http://127.0.0.1:3000' + '/api/role/getRole',
                    body: {
                        ID:  result.Role[i]
                    },
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        console.error(error)
                        return
                    }
                    else if(response.statusCode == 200)
                    {
                        rolesOfUser.push(response.body.role);
                        if(rolesOfUser.length == result.Role.length)
                        {
                            return res.status(200).json({ status: true, roles : rolesOfUser, authenticate: req.Authenticate});
                        }
                    }
                });
                const RoleModel = mongoose.model("Role");*/
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


module.exports.getUnauthenticatedUsers = (req, res, next) => {
    UserModel.find({  Authenticate : false},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'No unauthenticated users found' }); 
        else
        {
            UnauthenticatedUsers=[];
            for(var a=0; a<result.length; a++){
                UnauthenticatedUsers.push({ID : result[a]._id, email : result[a].Email, name : result[a].Name, surname : result[a].Surname});
            }
            return res.status(200).json({UnauthenticatedUsers});
        }
    });
}
//Only a security admin can make this request
//Parameters - None
//Returns - Array with all authernticated users objects
module.exports.getAllUsers = (req, res, next) => {
    UserModel.find({  Authenticate : true},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'No users found' }); 
        else
        {
            Users=[];
            for(var a=0; a<result.length; a++){
                Users.push({ID : result[a]._id, email : result[a].Email, name : result[a].Name, surname : result[a].Surname});
            }
            return res.status(200).json({Users});
        }
    });
}
//Only a security admin can make this request
//Request body - ID of user to authenticate
//Returns - Succes or error message
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

//Only a security admin can make this request
//Request body - ID of user to remove/reject
//Returns - Succes or error message
module.exports.remove = (req, res, next) => {
    UserModel.removeOne({ _id: req.body.UserID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' }); 
        else
            return res.status(200).json({message: 'User removed'});
               
    });
}
//Checks if the user is authenticated
//Returns - Value of Authenticated attribute
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
module.exports.getTasks = (req, res, next) => {
    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            var projectsOfUser = [];
            for(i=0; i<result.Team.length; i++)
            {
                TeamHelper.getTasksOfTeam(result.Team[i],(err,val)=>
                 {
                    if(val == false) 
                        return res.status(404).json({ message:  'No tasks found' });
                    else if(err)
                        return res.status(500).send({message: 'Internal Server Error: ' + err});
                    else 
                    {
                        projectsOfUser.push(val);
                        if(projectsOfUser.length == result.Team.length)
                        {
                            return res.status(200).json({projects : projectsOfUser});
                        }
                    }
                });
            }
        }
    });
}