const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const UserModel = mongoose.model("User");




var assert = require('assert');
router.get("/api/login", (req, res)=>{//// only returning all user details in the DB 
////Access DB
    var allUsersDetails = [];
    var user = new UserModel();
    var url="mongodb://localhost:27017/STAT";
    mongoose.connect(url,function(err, db){
        assert.equal(null, err);
        var cursor = db.collection('users').find();
        cursor.forEach(function(doc, err) {
          assert.equal(null, err);
          allUsersDetails.push(doc);
        }, function() {
          db.close();
          console.log(allUsersDetails);
          res.send(allUsersDetails);
        });
      })
    .catch(error=> console.log(error)) 
//Search  - (user with this email doesnt exist)

//Authenitcate email and password (Consult Vedha on hashing & salting algorithm choice)

//Return name,email,profile pic path

//Cookies?
 
});

router.post("/api/addUser", (req, res) => {
    var user = new UserModel();
    user.ID = db.User.find().Count()+1;
    user.ProfileName = req.body.profileName;
    user.ProfilePicture = req.body.profilePicture;
    user.Password = req.body.password;
    user.Name = req.body.name;
    user.Surname = req.body.surname;
    user.Email = req.body.email;
    user.Role = [5];
    user.save((err, doc) => {
        if(!err){
            res.send("Created User");
        }
        else{
            res.send("Error Occured");
        }
    })
});

router.post("/api/register", (req, res) => {
    var user = new UserModel();
    user.ID = db.User.find().Count()+1;
    user.ProfileName = req.body.profileName;
    user.ProfilePicture = req.body.profilePicture;
    user.Password = req.body.password;
    user.Name = req.body.name;
    user.Surname = req.body.surname;
    user.Email = req.body.email;
    user.Role = [2];
    user.save((err, doc) => {
        if(!err){
            res.send("Created System Administrator");
        }
        else{
            res.send("Error Occured");
        }
    })
});

router.post("/api/update", (req, res) => {
    res.send("Under Construction");
});


module.exports = router;
