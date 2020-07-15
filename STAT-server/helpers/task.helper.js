const mongoose = require("mongoose");
const TaskModel = mongoose.model("Task");

module.exports.getTaskName = (id, done)=>{
    TaskModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, [result.TaskName, _id]);
        
    });
}