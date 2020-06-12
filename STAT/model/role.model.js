const mongoose = require("mongoose")

var RoleSchema = new mongoose.Schema({
    ID:{
        type: Int32Array,
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