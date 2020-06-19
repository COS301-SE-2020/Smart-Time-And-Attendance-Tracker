const mongoose = require("mongoose")
const bcrypt=require("bcryptjs");
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    ID:{
        type: Number,
        required : "Required",
        unique: true
    },
    ProfilePicture:{
        type: String
    },
    Password:{
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

//Methods

UserSchema.methods.verifyPassword = function(password){
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJWT = function() {
    return jwt.sign({id: this.ID, roles: this.Role},
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        });
}

mongoose.model("User", UserSchema);
