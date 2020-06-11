const mongoose = require("mongoose")

var UserSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
    ProfileName:{
        type: String,
        required : "Required"
    },
    ProfilePicture:{
        type: String,  
        required : "Required"
    },
    Name:{
        type: String,
        required : "Required"
    },
    Surname:{
        type: String,
        required : "Required"
    },
    Email:{
        type: String,
        required : "Required"
    },
    Role:{
        type: Array
    }
});

mongoose.model("User", UserSchema);