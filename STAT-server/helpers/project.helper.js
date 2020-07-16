const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");
const TaskHelper =require('../helpers/task.helper');

module.exports.getTasks = (id, done)=>{
    ProjectModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done("Project not found.",false);
        else if(result)
        {
            var values = [], task=0, text="";
            for(task =0; task<result.Tasks.length; task++) 
            {
                TaskHelper.getTaskName(result.Tasks[task],(err,val)=> {
                    if(err)
                        done(err);
                    else if(val == false) 
                        done(err,false);
                    else 
                    {
                        values.push(val); 
                        if(values.length == result.Tasks.length)
                        {
                            text = {
                                'ID': result._id,
                                'projectName': result.ProjectName,
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