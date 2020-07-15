const mongoose = require("mongoose")

var TaskSchema = new mongoose.Schema({    
    TaskName:{
        type: String,
        required : "Required"
    },
    StartDate:{
        type: Date,
        required : "Required"
    },
    DueDate:{
        type: Date,
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
        enum : ['NOT STARTED', 'IN PROGRESS', 'COMPLETED'], 
        default: 'NOT STARTED' 
    }
});

mongoose.model("Task", TaskSchema);