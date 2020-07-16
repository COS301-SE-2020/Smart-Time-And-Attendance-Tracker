
const mongoose = require("mongoose");
const TeamModel = mongoose.model("teams");

const ProjectHelper =  require('../helpers/project.helper');

module.exports.assignProject = (req, res, next) => {
    
    TeamModel.findOne({_id : req.body.teamID}, function(err, result) {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result)
        {
            return res.status(404).send({message: 'Team not found'});
        }
        else {
            result.ProjectID = req.body.projectID;
           
            result.save((err, doc) => {
                if(!err)
                {
                    ProjectHelper.addTeam(result.Role[i],(err,val)=>
                    {
                        if(err)
                           return res.status(500).send({message: 'Internal Server Error: ' + err});
   
                       else if(val == false) 
                           return res.status(404).json({ message: 'Project not found' });
                       else 
                       {
                        return res.status(200).json({TeamID: result._id , message: 'Project successfully assigned to team'});
                       }
                   });
               }  

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
            return res.status(404).send({message: 'Team not found'});
        }
        else {
            result.TeamMembers.push( { _id: req.body.userID, Role: req.body.userRole } )
            result.save((err, doc) => {
                if(!err)
                {
                    req.TeamID = result._id;
                    next();
                    //return res.status(200).json({ message: 'Member added successfully', "TeamID": result._id });
                }
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            });
        }
    });
}



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

*/
