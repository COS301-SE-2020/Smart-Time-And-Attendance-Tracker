const mongoose = require("mongoose")

var OrganisationSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
    OrganisationName:{
        type: String,
        required : "Required"
    },
    SystemAdminstrator:{
        type: Array,
        required : "Required"
    }, 
    SecurityAdminstrator:{
        type: Array,
    },
    DataAnalyst:{
        type: Array,
    }
});

mongoose.model("Organisation", OrganisationSchema);