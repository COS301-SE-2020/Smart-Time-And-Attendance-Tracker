const mongoose = require("mongoose")

var TeamSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
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