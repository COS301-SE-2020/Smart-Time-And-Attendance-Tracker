const mongoose = require("mongoose")

var TeamSchema = new mongoose.Schema({
    Projects:{
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
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            Role: {
                type: String
            }
        }
    ],
});

mongoose.model("Team", TeamSchema);