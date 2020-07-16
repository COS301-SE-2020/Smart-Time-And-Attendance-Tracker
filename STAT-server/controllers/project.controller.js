
const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");

/**
 * receives project details
 * - ensure person adding is a authenticated user
 * - 
 */
module.exports.add = (req, res, next) => {
    console.log(req.body.Teams.length);
    var project = new ProjectModel();
    project.ProjectName = req.body.ProjectName;
    project.TimeSpent = req.body.TimeSpent;
    project.DueDate = req.body.DueDate;
    project.Completed = req.body.Completed;
    teams=[];
    tasks=[];
    for(var i=0; i< req.body.Teams.length; i++){
        teams.push(req.body.Teams[i]);
        console.log(req.body.Teams[i]);
    }
    project.Teams = teams;

    for(var i=0; i< req.body.Tasks.length; i++){
        tasks.push(req.body.Tasks[i]);
    }
    project.Tasks = tasks;

    project.save((err, doc) => {
        if(!err){
            return res.status(200).json({ ProjectID : _id, message: 'Project Created' });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}

module.exports.addTask = (req, res, next) => {
        ProjectModel.findOne({UserID : req.ID}, function(err, result) {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result)
        {
            var userTimeEntry = new UserTimeEntryModel();
            userTimeEntry.UserID = req.ID;
            userTimeEntry.TimeEntries = [timeEntryDoc];
            userTimeEntry.save((err, doc) => {
            if(!err)
                return res.status(200).json({ message: 'Time recorded successfully', "TimeEntryID": timeEntryDoc._id });
            else 
            {
                if (err.code == 11000)
                    res.status(409).send({message: 'Time record already exists'});
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                }
            });
        }
        else {
            result.TimeEntries.push(timeEntryDoc);
            result.save((err, doc) => {
                if(!err)
                    return res.status(200).json({ message: 'Time recorded successfully', "TimeEntryID": timeEntryDoc._id });
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            });
        }
    });
}

