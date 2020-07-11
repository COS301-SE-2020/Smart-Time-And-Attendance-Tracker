const mongoose = require("mongoose")

var ProjectSchema = new mongoose.Schema({ 
    ProjectTitle:{
        type: String,
        required : "Required"
    },
    TotlaTimeSpent:{
        type: Number,
        required : "Required"
    },
    DueDate:{
        type: Number,
        required : "Required"
    },
    Task: [
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
        type: Boolean,  
        required : "Required."
    }
});

mongoose.model("Project", ProjectSchema);