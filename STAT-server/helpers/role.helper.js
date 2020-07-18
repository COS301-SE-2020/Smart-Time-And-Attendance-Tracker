const mongoose = require("mongoose");
const RoleModel = mongoose.model("Role");

module.exports.getRole = (id, done)=>{
    RoleModel.findOne({ID: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, result.Role);
        
    });
}


