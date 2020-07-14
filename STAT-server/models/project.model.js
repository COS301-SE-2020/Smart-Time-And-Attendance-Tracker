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
    DueDate:{
        type: Date,
        required : "Required"
    },
    Tasks: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Task' 
        }
    ],
    Teams: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' 
    },
    Completed:{
        type: Boolean,  
        required : "Required."
    }
});

mongoose.model("Project", ProjectSchema);