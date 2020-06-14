require("../config/passportConfig");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
router.use(passport.initialize());
var assert = require('assert');
router.use( bodyParser.json() ); 
const UserModel = mongoose.model("User");
const bcrypt=require("bcrypt");
const JWThelper = require("../config/jwtHelper");

router.post("/api/login", (req, res,next) =>{
    //call for passport authentication
    passport.authenticate('local', (err,user,info)=>{
        //error from passport
        if(err)
            return res.status(400).json(err);
        //registered user
        else if(user) 
            return res.status(200).json({"token": user.generateJWT(), "roles": user.Roles});
        //unknown user or wrong password
        else
            return res.status(404).json(info);
    })(req,res);
});

/*(req, res)=>{
    var user = new UserModel();
    if (req.body.email && req.body.password){
        mongoose.connect(url,function(err, db){
            assert.equal(null, err);
            var cursor = db.collection('users').findOne({'Email':req.body.email}, 
            (err,cons) => {
                if (!cons) {
                   var errors = new Error('User doesnt exists.');
                   errors.status = 400;
                   errors.name = 'Couldnt find your account';
                   res.send(errors);
                   return;
                }
                else{
                    //res.send(cons);
                      bcrypt.compare(req.body.password, cons.Password, function (err, result) {
                        if (result === true) {
                            //res.send(req.body.password);
                            var logedin={"status":"200 ok", "public key":"",
                                         "session":"", "message":"logged in succssfully"};
                            res.send(logedin);

                        } else {
                            
                            var errors = new Error('Empty fileds.');
                            errors.status = 400;
                            errors.name = 'Please fill the fields';
                            res.send(errors);
                            return;
                        }
                      })
                }
            });
        })
        .catch(error=> console.log(error))
    }else{ 
        var errors = new Error('Empty fileds.');
        errors.status = 400;
        errors.name = 'Please fill the fields';
        res.send(errors);
        return;
    }
});*/


// create application/json parser
//var jsonParser = bodyParser.json();
/*
router.post("/api/addUser", (req, res) => {
    var user = new UserModel();
    
    user.ID = 45;;//db.User.find().Count()+1;
    user.ProfileName = req.body.profileName;
    user.ProfilePicture = req.body.profilePicture;
    user.Password = req.body.password;
    user.Name = req.body.name;
    user.Surname = req.body.surname;
    user.Email = req.body.email;
    user.Role = [5];
    console.log(req);
    res.send( req);
   /* user.save((err, doc) => {
        if(!err){
            res.send("Created User");
        }
        else{
            res.send(err);
        }
    })
});*/

router.post("/api/register", (req, res) => { ///missing validations - 
    if (req.body.password !== req.body.passwordConf) {
        var errors = new Error('Passwords do not match.');
        errors.status = 400;
        errors.name = 'Passwords do not match.';
        res.send(errors);
        return;
    }
    UserModel.findOne({"Email": req.body.email},
    (err, user)=> {
        if(user)
        {
            var errors = new Error('An account is already registered with that email.');
            errors.status = 400;
            errors.name = 'An account is already registered with that email.';
            res.send(errors);
            return;
        }
        else{}});
    if (req.body.email && req.body.password && req.body.passwordConf &&
        req.body.profileName && req.body.name &&
        req.body.surname )
        
        {  
            var user = new UserModel();
            user.ID =Math.floor(Math.random() * Math.floor(1000));; //db.User.find().Count()+1;
            user.ProfileName = req.body.profileName;
           // user.Password = req.body.password;
            user.Name = req.body.name;
            user.Surname = req.body.surname;
            user.Email = req.body.email;
            user.Role = [5];

            bcrypt.hash(req.body.password, 10, function (err, hash){
                if (err) {
                    var errors = new Error('Password not Hashed.');
                    errors.status = 400;
                    errors.name = 'Something went wrong.';
                    res.send(errors);
                }
                 user.Password = hash;
                 user.save((err, doc) => {
                    if(!err){
                    return res.status(200).json({"token": user.generateJWT(), "roles": user.Roles});
                    }
                    else{
                        res.send(err);
                    }
                })
            })
    }
    else{
        var errors = new Error('All fields required.');
        errors.status = 400;
        errors.name = 'All fields required.';
         res.send(errors);
    }
});


router.post("/api/update", (req, res) => {
    res.send("Under Construction");
});


module.exports = router;
