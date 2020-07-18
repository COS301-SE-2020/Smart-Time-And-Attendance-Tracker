
const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");
const TaskHelper = require("../helpers/task.helper");

module.exports.complete = (req, res) => {
    ProjectModel.update({ _id: req.body.ProjectID},{Completed: true},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'Project not found' }); 
        else
            return res.status(200).json({message: 'Project marked as completed'});
                
    });
}

module.exports.uncomplete = (req, res) => {
    ProjectModel.update({ _id: req.body.ProjectID},{Completed: false},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'Project not found' }); 
        else
            return res.status(200).json({message: 'Project marked as uncompleted'});
                
    });
}

module.exports.update = (req, res) => {
    var updated = false;
    var error;
    if(req.body.projectName)
    {
        ProjectModel.update({ _id: req.body.projectID},{ProjectName: req.body.projectName},(err, result) => {
            if (err) 
                error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(req.body.timeSpent)
    {
        ProjectModel.update({ _id: req.body.projectID},{TimeSpent: req.body.timeSpent},(err, result) => {
            if (err) 
                error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(req.body.dueDate)
    {
        ProjectModel.update({ _id: req.body.projectID},{DueDate: req.body.dueDate},(err, result) => {
            if (err) 
                error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(req.body.hourlyRate)
    {
        ProjectModel.update({ _id: req.body.projectID},{HourlyRate: req.body.hourlyRate},(err, result) => {
            if (err) 
                error = err;
            else if(result)
                updated = true;
                    
        });
    }
    if(err)
        return res.status(500).send({message: 'Internal Server Error: ' + error});
    else if(updated)
        return res.status(200).json({message: 'Project successfully updated'});
    else
        return res.status(404).json({message: 'Project not found'}); 
}

/**
 * receives project details
 * - ensure person adding is a authenticated user
 * - 
 */
module.exports.add = (req, res, next) => {
   
    var project = new ProjectModel();
    project.ProjectName = req.body.projectName;
    project.TimeSpent = 0;
    project.DueDate = req.body.dueDate;
    project.StartDate = req.body.startDate;
    project.Completed = false;
    project.HourlyRate = req.body.hourlyRate;
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
            return res.status(200).json({ projectID : doc._id, message: 'Project Created' });
        }
        else{
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
    })
}

module.exports.addTask = (req, res, next) => {

        ProjectModel.findOne({_id : req.body.projectID}, function(err, result) {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        }
        else if (!result)
        {
            return res.status(404).send({message: "Project not found"});
        }
        else {
            result.Tasks.push(req.TaskID);
            result.save((err, doc) => {
                if(!err)
                    return res.status(200).json({ taskID: req.TaskID, message: 'Task created and added to project' });
                else
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
            });
        }
    });

}


module.exports.deleteProject = (req, res) => {  
    ProjectModel.findOne({_id: req.query.projectID},(err,val)=>{
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!val) 
            return res.status(404).json({ message: 'Project not found' });
        else 
        {
            TaskHelper.deleteTask(val.Tasks,(err,result)=>
            {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else
                {
                    ProjectModel.deleteOne({_id: req.query.projectID},(err,val)=>{
                        if(err)
                            return res.status(500).send({message: 'Internal Server Error: ' + err});
    
                        else 
                            return res.status(200).json({ message: 'Project successfully deleted '});
                    });   
                    
                }
            });
                
        }    
        
    });
}
module.exports.deleteTask = (req, res, next) => {  
    ProjectModel.updateOne({_id: req.query.projectID},{ $pull: { 'Tasks':   req.query.taskID}},(err,val)=>{
        if(err)
            return res.status(500).send({message: 'Internal Server Error: ' + err});
        else if (!val) 
            return res.status(404).json({ message: 'Project not found' });
        else 
        {
              next();  
        }    
        
    });
}


module.exports.complete = (req, res, next) => {

    ProjectModel.updateOne({_id : req.body.ProjectID, Completed: true},function(err, result) {
    if(err) 
        return res.status(500).send({message: 'Internal Server Error: ' + err});
    else if (!result)
       return res.status(404).send({message: "Project not found"});
    else 
        return res.status(200).json({ projectID: req.body.ProjectID, message: 'Project marked as completed' });
          
});
}

