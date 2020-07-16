
const mongoose = require("mongoose");
const TeamModel = mongoose.model("Team");


module.exports.add = (req, res, next) => {
    var team = new TeamModel();
    team.TeamLeader = req.ID;
    /*var teamMembers = [];
    for(var i=0; i< req.body.teamMembers.length; i++)
        teamMembers.push(req.body.teamMembers[i]);
    team.TeamMembers = teamMembers;
    console.log( req.body.teamMembers.length);*/
    team.save((err, doc) => {
        if(!err){
            return res.status(200).json({ TeamID : doc._id, message: 'Team Created' });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}


/*router.post("/update", (req, res) => {
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

module.exports = router;*/
