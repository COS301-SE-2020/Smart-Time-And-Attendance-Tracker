const mongoose = require("mongoose")

var TeamSchema = new mongoose.Schema({
    ProjectID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },    
    TeamLeader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required : "Required"
    },
    TeamMembers:[
        { 
            _id : {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User'
            },
            Role: {
                type: String
            }
        }
    ],
});

mongoose.model("teams", TeamSchema);