const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/STAT", {useNewUrlParser: true}, (error)=>{

    if(!error)
    {
        console.log("Sucess Connected")
    }
    else{
        console.log("Error connecting to database.")
    }
});

const Organisation = require("./organisation.model")
const Project = require("./project.model")
const User = require("./user.model")
const Task = require("./task.model")
const Team = require("./team.model")
const Role = require("./role.model")
