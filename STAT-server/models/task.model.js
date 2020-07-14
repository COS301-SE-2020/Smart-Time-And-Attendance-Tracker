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
    Completed:{
        type: Boolean,
        required : "Required"
    }
});

mongoose.model("Task", TaskSchema);