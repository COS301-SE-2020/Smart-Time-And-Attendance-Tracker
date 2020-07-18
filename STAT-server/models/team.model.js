const mongoose = require("mongoose")

var TeamSchema = new mongoose.Schema({
    ProjectID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', 
        //required : "Required"     //will the project be assigned to the team when team is created?
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