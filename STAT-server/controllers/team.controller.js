
const mongoose = require("mongoose");
const TeamModel = mongoose.model("teams");
const ProjectHelper =  require('../helpers/project.helper');
const UserHelper =  require('../helpers/user.helper');


module.exports.assignProject = (req, res, next) => {
    
    TeamModel.updateOne({_id : req.teamID},{ProjectID:req.ProjectID }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else
        {
            
        ProjectHelper.addTeam(req.ProjectID, req.teamID,(err,val)=>
        {
            if(err)
                return res.status(500).send({message: 'Internal Server Error: ' + err});

            else if(val == false) 
                return res.status(404).json({ message: 'Project not found' });
            else 
            {
                return res.status(200).json({projectID: req.ProjectID,teamID: req.teamID, message: 'Project successfully added to team'});
            }
        });
        }  
    });
}

module.exports.addTeamMember = (req, res, next) => {

    TeamModel.updateOne({_id : (req.body.TeamID)},{ $push: { TeamMembers: { _id: req.body.UserID, Role: req.body.UserRole } } }, function(err, result) {
        if(err) 
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!result)
            return res.status(404).send({message: 'Team not found'});
        else {
            req.TeamID = result._id;
            next();
            //return res.status(200).json({ message: 'Member added successfully', "TeamID": result._id });     
        }
    });
}


module.exports.createTeam = (req, res, next) => {
    var team = new TeamModel();
    team.TeamLeader = req.ID;
    team.ProjectID = req.ProjectID;
    /*var teamMembers = [];
    for(var i=0; i< req.body.teamMembers.length; i++)
        teamMembers.push(req.body.teamMembers[i]);
    team.TeamMembers = teamMembers;
    console.log( req.body.teamMembers.length);*/
    team.TeamMembers.push({ _id : team.TeamLeader, Role: "Team Leader"});
    team.save((err, doc) => {
        if(!err){
            req.teamID = doc._id;
            UserHelper.addTeam(team.TeamLeader, req.teamID,(err,val)=>
            {
                if(err)
                   return res.status(500).send({message: 'Internal Server Error55: ' + err});

               else if(val == false) 
                   return res.status(404).json({ message: 'User not found' });
               else 
                next(); 
                  
        
           });
            //req.body.projectID = req.ProjectID;
            //return res.status(200).json({ teamID : doc._id, message: 'Team Created' });
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


module.exports = router;
*/

