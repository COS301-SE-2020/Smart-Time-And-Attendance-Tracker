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


