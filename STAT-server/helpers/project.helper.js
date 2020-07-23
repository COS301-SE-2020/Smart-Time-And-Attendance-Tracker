const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");
const TaskHelper =require('../helpers/task.helper');

module.exports.addTeam = (id, teamID, done)=>{
    ProjectModel.updateOne({_id: id},{Team: teamID},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, true);
        
    });
}

module.exports.hourlyRate = (id, done)=>{
    ProjectModel.find({_id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, result.HourlyRate);
        
    });
}

module.exports.getTasks = (id, done)=>{
    ProjectModel.findOne({ _id: id},{ Completed: false},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
        {
            var values = [], task=0, text="";
            if(result.Tasks.length ==0)
            {
                text = {
                    'ID': result._id,
                    'projectName': result.ProjectName,
                    "dueDate": result.DueDate,
                    "hourlyRate": result.HourlyRate,
                    "tasks": []

                }
                done(null, text);
            }
            for(task; task<result.Tasks.length; task++) 
            {
                TaskHelper.getTaskName(result.Tasks[task],(err,val)=> {
                    if(err)
                        done(err);
                    else if(val)
                    {
                        values.push(val); 
                        if(values.length == result.Tasks.length)
                        {
                            text = {
                                'ID': result._id,
                                'projectName': result.ProjectName,
                                "dueDate": result.DueDate,
                                "hourlyRate": result.HourlyRate,
                                'tasks': values

                            }
                            done(null, text);
                        }                       
                    }
                });
            }
            
        }
           
        
    });
}

