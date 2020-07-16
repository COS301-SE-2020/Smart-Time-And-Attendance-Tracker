const mongoose = require("mongoose");
const TeamModel = mongoose.model("Team");
const ProjectHelper =require('../helpers/project.helper');

module.exports.getTasksOfTeam = (id, done)=>{
    TeamModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done("Team not found.",false);
        else if(result)
        {
            ProjectHelper.getTasks(result.ProjectID,(err,val)=> {
                if(err)
                    done(err);
                else if(val == false) 
                    done(err,false);
                else 
                {
                    done(null, val);
                    
                }
            });
        }
           
        
    });
}