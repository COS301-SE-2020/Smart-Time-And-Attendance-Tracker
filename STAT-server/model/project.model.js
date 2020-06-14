const mongoose = require("mongoose")

var ProjectSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
    OrganisationID:{
        type: Number,
        required : "Required"
    },
    ClientName:{
        type: String,
        required : "Required"
    }, 
    ProjectTitle:{
        type: String,
        required : "Required"
    },
    TotlaTime:{
        type: Number,
        required : "Required"
    }
});

mongoose.model("Project", ProjectSchema);