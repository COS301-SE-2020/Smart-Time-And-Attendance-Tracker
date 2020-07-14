const mongoose = require("mongoose")

var TeamSchema = new mongoose.Schema({
    ProjectID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', 
        required : "Required"
    },    
    TeamLeader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required : "Required"
    },
    TeamMembers:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            Role: {
                type: String
            }
        }
    ],
});

mongoose.model("Team", TeamSchema);