const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");

module.exports.addTeam = (id, done)=>{
    ProjectModel.update({_id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, true);
        
    });
}
