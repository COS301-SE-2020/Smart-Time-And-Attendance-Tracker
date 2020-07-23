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