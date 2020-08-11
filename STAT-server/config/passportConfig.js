/**
  * @file STAT-server/config/passportConfig.js
  * @author Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
  * @fileoverview This file validates login.
  * @date 14 June 2020
 */

/**
* Filename:             STAT-server/config/passportConfig.js
*
* Author:               Vedha Krishna Velthapu, Jana Sander, Jesse Mwiti
*   
* File Creation Date:   14 June 2020
*
* Development Group:    Visionary
*
* Project:              Smart Time and Attendance Tracker
*
* Description:         This file validates login.
*
*/
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const UserModel = mongoose.model("User");

passport.use(
    new localStrategy({usernameField:'email'}, 
    (username, password, done) =>{
        UserModel.findOne({"Email": username.toLowerCase()},
            (err, user)=> {
                if(err)
                    return done(err);
                //User not found
                else if(!user)
                    return done(null, false, {message: "User not found"});
                //Wrong password
                else if(!user.verifyPassword(password))
                    return done(null, false, {message: "Incorrect password"});    

                //Successful authentication
                else
                    return done(null, user);

            });
    })
);