const mongoose = require("mongoose")

var TaskSchema = new mongoose.Schema({    
    TaskName:{
        type: String,
        required : "Required"
    },
    StartDate:{
        type: String,
        required : "Required"
    },
    DueDate:{
        type: String,
        required : "Required"
    },
    TimeSpent:{
        type: Number
        //required : "Required"
    },
    /*ExpectedCost:{
        type: Number,
        required : "Required"
    },*/
    MonetaryValue:{
        type: Number
       // required : "Required"
    },
    Status:{
        type: String,
        enum : ['Not Started', 'In Progress', 'Completed'], 
        default: 'Not Started' 
    }
});

mongoose.model("Task", TaskSchema);