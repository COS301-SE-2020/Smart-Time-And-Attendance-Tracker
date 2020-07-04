const mongoose = require("mongoose")

var ProjectSchema = new mongoose.Schema({
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