/*

const path = require("path");
const expressHandlerbars = require("express-handlebars");

application.use(bodyParser.urlencoded({
    extended : true
}));

const OrganisationController = require("./controller/organisation");
application.use("/organisation", OrganisationController);

const UserController = require("./controller/user");
application.use("/user", UserController);

const ProjectController = require("./controller/project");
application.use("/project", ProjectController);

const TaskController = require("./controller/task");
application.use("/task", TaskController);

const TeamController = require("./controller/team");
application.use("/team", TeamController);

const RoleController = require("./controller/role");
application.use("/team", RoleController);
*/
require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const routes = require('./routes/index.router');

const application = express();

// middleware
application.use(bodyParser.json());
application.use(cors());
application.use(passport.initialize());
application.use('/api', routes);

// error handler
application.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    
});

// start server
application.listen("3000"), ()=>{
    console.log("Server started");
};

application.get('/calendar/', (req, res) => {
    res.sendFile(__dirname + '/calendar/index.html');
  });
