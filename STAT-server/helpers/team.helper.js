const mongoose = require("mongoose");
const TeamModel = mongoose.model("Team");
const ProjectHelper =require('../helpers/project.helper');

module.exports.getTasksOfTeam = (id, done)=>{
    TeamModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
        {
            ProjectHelper.getTasks(result.ProjectID,(err,val)=> {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + error});
                else if(val == false) 
                    return res.status(404).json({ message: 'Role not found' });
                else 
                {
                    done(null, val);
                    
                }
            });
        }
           
        
    });
}