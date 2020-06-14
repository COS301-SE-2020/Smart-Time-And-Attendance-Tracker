const mongoose = require("mongoose")

var testing="";
var uri = "mongodb+srv://TeamVisionary:Capstone301@cluster0-ocdej.azure.mongodb.net/Smart-Time-And-Attendance-Tracker?retryWrites=true&w=majority"; 
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (error,db)=>{

    if(!error)
    {
        testing=db;
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
