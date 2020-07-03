const mongoose = require("mongoose")
const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');

var UserTimeEntrySchema = new mongoose.Schema({
    ID:{
        type: String,
        required : "ID required.",
        unique: true
    },
    TimeEntry: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'TimeEntry' 
        }
    ]
});

mongoose.model("UserTimeEntry", UserTimeEntrySchema);
