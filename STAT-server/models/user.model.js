const mongoose = require("mongoose")
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    ProfilePicture:{
        type: String
    },
    Password:{
        type: String,  
        required : "Password required."
    },
    Name:{
        type: String,
        required : "Name required."
    },
    Surname:{
        type: String,
        required : "Surname required."
    },
    Email:{
        type: String,
        required : "Email required.",
        unique: true
    },
    Role:{
        type: Array,
        required : "Role required.",
    },
    Authenticate:{
        type: Boolean,  
        required : "Authentication required."
    }
});

//Methods

UserSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.Password);
};

UserSchema.methods.generateJWT = function() {
    return jwt.sign({id: this._id}, //,authenticate: this.Authenticate, roles: this.Role},
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        });
}

UserSchema.pre('save',function(next){
    bcrypt.genSalt(10,(err,salt) => {
       bcrypt.hash(this.Password,salt,(err,hash) => {
           this.Password=hash;
           this.saltedsecret=salt;
           next();
       });
    });
});

mongoose.model("User", UserSchema);
