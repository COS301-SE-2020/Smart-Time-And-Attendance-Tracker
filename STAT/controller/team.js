const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const TeamModel = mongoose.model("Team");
router.get("/", (req, res)=>{
    res.send("Team controller");
});

router.post("/add", (req, res) => {
    var team = new TeamModel();
    team.ID = db.Team.find().Count()+1;
    team.ProjectID = req.body.projectID;
    team.TeamLeader = req.body.teamLeader;
    team = [];
    for(var i=0; i< req.body.teamMembersSize; i++)
        team.push(req.body.teamMembers[i]);
    team.TeamMembers = team;
    task.save((err, doc) => {
        if(!err){
            res.send("Created Team");
        }
        else{
            res.send("Error Occured");
        }
    })
});

router.post("/update", (req, res) => {
    var team = new TeamModel();
    team.ID = req.body.teamID;
    db.collection("Team").update({"ID" : req.body.teamID}, {$push: {"TeamMembers" :req.body.newMember }});
    task.save((err, doc) => {
        if(!err){
            res.send("Updated Team");
        }
        else{
            res.send("Error Occured");
        }
    })
});

module.exports = router;
