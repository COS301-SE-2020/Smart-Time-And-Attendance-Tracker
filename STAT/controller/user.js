const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const UserModel = mongoose.model("User");
router.get("/", (req, res)=>{
    res.send("User controller");
});

router.post("/add", (req, res) => {
    var user = new UserModel();
    user.ID = db.User.find().Count()+1;
    user.ProfileName = req.body.profileName;
    user.ProfilePicture = req.body.profilePicturePath;
    user.Password = req.body.password;
    user.Name = req.body.name;
    user.Surname = req.body.surname;
    user.Email = req.body.email;
    user.Role = [];
    user.save((err, doc) => {
        if(!err){
            res.send("Created User");
        }
        else{
            res.send("Error Occured");
        }
    });
});

module.exports = router;
