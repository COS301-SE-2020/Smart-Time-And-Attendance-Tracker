const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const UserModel = mongoose.model("User");
const OrganisationModel = mongoose.model("Organisation");
const ProjectModel = mongoose.model("Project");
const RoleModel = mongoose.model("Role");
const TaskModel = mongoose.model("Task");
const TeamModel = mongoose.model("Team");

passport.use(
    new localStrategy({usernameField:'email'}, 
    (username, password, done) =>{
        UserModel.findOne({email: username},
            (err, user)=> {
                if(err)
                    return done(err);
                //User not found
                else if(!user)
                    return done(null, false, {message: "No user with the given email was found"});
                //Wrong password
                else if(!user.verifyPassword(password))
                    return done(null, false, {message: "Incorrect password."});  
                //Successful authentication
                else
                    return done(null, user);

            });
    })
);