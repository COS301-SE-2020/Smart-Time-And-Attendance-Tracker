const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");
const TaskHelper =require('../helpers/task.helper');

module.exports.getTasks = (id, done)=>{
    ProjectModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
        {
            var values = [];
            for(task in result.Tasks) 
            {
                TaskHelper.getTaskName(result.Tasks[task],(err,val)=> {
                    if(err)
                        return res.status(500).send({message: 'Internal Server Error: ' + error});
                    else if(val == false) 
                        return res.status(404).json({ message: 'Role not found' });
                    else 
                    {
                        values.push(val);                        
                    }
                });
            }
            done(null, values);
        }
           
        
    });
}