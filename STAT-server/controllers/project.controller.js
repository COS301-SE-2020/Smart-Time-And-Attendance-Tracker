
const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");

/**
 * receives project details
 * - ensure person adding is a authenticated user
 * - 
 */
module.exports.add = (req, res, next) => {
    console.log("Hello");
    var project = new ProjectModel();
    project.ProjectName = req.body.projectName;
    project.TimeSpent = 0;
    project.DueDate = req.body.dueDate;
    project.StartDate = req.body.startDate;
    project.Completed = false;
    /*teams=[];
    tasks=[];

    for(var i=0; i< req.body.Teams.length; i++){
        teams.push(req.body.Teams[i]);
        console.log(req.body.Teams[i]);
    }
    project.Teams = teams;

    for(var i=0; i< req.body.Tasks.length; i++){
        tasks.push(req.body.Tasks[i]);
    }
    project.Tasks = tasks;*/

    project.save((err, doc) => {
        if(!err){
            return res.status(200).json({ ProjectID : doc._id, message: 'Project Created' });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}

module.exports.addTask = (req, res, next) => {
    console.log("Hello");
        ProjectModel.findOne({_id : req.body.projectID}, function(err, result) {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result)
        {
           return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else {
            result.Tasks.push(req.TaskID);
            result.save((err, doc) => {
                if(!err)
                    return res.status(200).json({ TaskID: req.TaskID, message: 'Task created and added to project' });
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            });
        }
    });
}

