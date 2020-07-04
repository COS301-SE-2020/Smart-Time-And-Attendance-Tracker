const mongoose = require("mongoose")

var TaskSchema = new mongoose.Schema({
    ProjectID:{
        type: String,
        required : "Required"
    },    
    TaskName:{
        type: String,
        required : "Required"
    },
    StartTime:{
        type: Date,
        required : "Required"
    },
    TimeSpent:{
        type: String,
        required : "Required"
    },
    ExpectedCost:{
        type: Number,
        required : "Required"
    },
    MonetaryValue:{
        type: Number,
        required : "Required"
    }
});

mongoose.model("Task", TaskSchema);