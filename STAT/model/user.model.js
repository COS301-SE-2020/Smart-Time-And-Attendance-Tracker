const mongoose = require("mongoose")
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');

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
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJWT = function() {
    return jwt.sign({id: this.ID, roles: this.Role},
        process.env.JWT_SECRET);
}

mongoose.model("User", UserSchema);