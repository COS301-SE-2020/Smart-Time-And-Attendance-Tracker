const mongoose = require("mongoose")

var OrganisationSchema = new mongoose.Schema({
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