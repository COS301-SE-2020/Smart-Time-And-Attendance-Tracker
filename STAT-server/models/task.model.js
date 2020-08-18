const mongoose = require("mongoose")

var TaskSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
    ProjectID:{
        type: Number,
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
        type: Number,
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