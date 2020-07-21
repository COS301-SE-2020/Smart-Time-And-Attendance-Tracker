const mongoose = require("mongoose");
const TeamModel = mongoose.model("teams");
const ProjectHelper =require('../helpers/project.helper');


module.exports.deleteTeam = (id, done) => {   

    TeamModel.findOne({_id: id},(err,val)=>{
        if(err)
            done(err);
        else   
        {
            TeamModel.deleteOne({_id: id},(err,result)=>{
                if(err)
                    done(err);
                else   
                    done(null, val);
            });
        }
    });   
 }

module.exports.getTasksOfTeam = (id, done)=>{
    TeamModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if (!result.ProjectID)
            done(null,false);
        else if(result)
        {
    
            ProjectHelper.getTasks(result.ProjectID,(err,val)=> {
                console.log("project" + result.ProjectID);
                if(err)
                    done(err);
                else if(val == false) 
                    done(null,false);
                else
                    done(null, val);   
            
            });
        }
           
        
    });
}