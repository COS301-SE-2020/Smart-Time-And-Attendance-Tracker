//const express = require("express");
//const router = express.Router();
const mongoose = require("mongoose");
const TeamModel = mongoose.model("teams");
// router.get("/", (req, res)=>{
//     res.send("Team controller");
// });

module.exports.assignProject = (req, res, next) => {
    TeamModel.findOne({_id : req.body.teamID}, function(err, result) {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result)
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else {
            result.ProjectID = req.body.projectID;
           
            result.save((err, doc) => {
                if(!err)
                    return res.status(200).json({ message: 'Project assigned to team successfully', "TeamID": result._id });
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            });
        }
    });
}

module.exports.addTeamMember = (req, res, next) => {
    TeamModel.findOne({_id : (req.body.teamID)}, function(err, result) {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result)
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else {
            console.log(result);
            result.TeamMembers.push( { _id: req.body.userID, Role: req.body.userRole } )
            result.save((err, doc) => {
                if(!err)
                    return res.status(200).json({ message: 'Member added successfully', "TeamID": result._id });
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            });
        }
    });
}

/*
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
*/