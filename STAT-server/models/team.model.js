const mongoose = require("mongoose")

var TeamSchema = new mongoose.Schema({
    ProjectID:{
        type: Number,
        required : "Required"
    },    
    TeamLeader:{
        type: Number,
        required : "Required"
    },
    TeamMembers:{
        type: Array,
        required : "Required"
    }
});

mongoose.model("Team", TeamSchema);