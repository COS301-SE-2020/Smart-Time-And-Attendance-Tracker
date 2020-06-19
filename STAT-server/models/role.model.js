const mongoose = require("mongoose")

var RoleSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
    Role:{
        type: String,
        required : "Required",
        unique: true
    }
});

mongoose.model("Role", RoleSchema);