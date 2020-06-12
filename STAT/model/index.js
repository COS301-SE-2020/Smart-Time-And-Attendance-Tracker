const mongoose = require("mongoose")
var uri = "mongodb+srv://<Team>:<Capstone301>@cluster0-ocdej.azure.mongodb.net/test";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (error)=>{

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
