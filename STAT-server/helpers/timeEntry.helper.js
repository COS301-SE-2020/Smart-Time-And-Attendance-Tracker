const mongoose = require("mongoose");
const TimeEntryModel = mongoose.model("TimeEntry");

module.exports.getTimeEntry = (id, done)=>{
    TimeEntryModel.findOne({ _id: id},(err, result) => {
        if(err) 
            done(err);
        else if (!result)
            done(null,false);
        else if(result)
           done(null, result);
        
    });
}

