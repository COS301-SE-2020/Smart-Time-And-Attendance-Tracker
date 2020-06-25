const mongoose = require('mongoose');
require("../config/config.js");

mongoose.connect(process.env.MONGODB_URI, (err) => {
    if (!err) { console.log('MongoDB connection succeeded.'); }
    else { console.log('Error in MongoDB connection : ' + JSON.stringify(err, undefined, 2)); }
});

const Organisation = require("./organisation.model")
const Project = require("./project.model")
const User = require("./user.model")
const Task = require("./task.model")
const Team = require("./team.model")
const Role = require("./role.model")