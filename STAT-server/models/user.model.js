/**
  * @file STAT-server/models/user.model.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file contains the User model in our database
  * @date 11 June 2020
 */

/**
* Filename:             STAT-server/models/user.model.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   11 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:          This file contains the User model in our database
*
*/ 

const mongoose = require("mongoose")
const bcrypt=require("bcryptjs");
const jwt = require('jsonwebtoken');

/**
 * This is the User Model Schema.
 */
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
    Projects:[
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Team' 
        }
    ],
    Authenticate:{
        type: Boolean,  
        required : "Authentication required."
    }
});

/**
 * 
 * @param {String} password user input
 * @returns {Boolean} returns true if password matches, else false
 */
UserSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.Password);
}

/**
 * Generates and returns a token.
 * @returns {string} Returns a token.
 */
UserSchema.methods.generateJWT = function() {
    return jwt.sign({id: this._id}, 
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        });
}


/**
 * 
 * @returns {void}
 */
UserSchema.pre('save',function(next){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(this.Password, salt);    
    this.Password=hash;
    //this.saltedsecret=salt;
    next();
   /* bcrypt.genSalt(10,(err,salt) => {
       bcrypt.hash(this.Password,salt,(err,hash) => {
           this.Password=hash;
           this.saltedsecret=salt;
           next();
       });
    });*/
});

mongoose.model("User", UserSchema);
