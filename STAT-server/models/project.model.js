const mongoose = require("mongoose")

var ProjectSchema = new mongoose.Schema({ 
    ProjectName:{
        type: String,
        required : "Required"
    },
    TimeSpent:{
        type: Number
        //required : "Required"
    },
    StartDate:
    {
        type: String,
        required : "Required"
    },
    DueDate:{
        type: String,
        required : "Required"
    },
    Tasks: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Task' 
        }
    ],
    Team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' 
    },
    Completed:{
        type: Boolean
    }
});

mongoose.model("Project", ProjectSchema);