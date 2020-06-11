const connection = require("./model")

const express = require("express");
const application = express();
const path = require("path");
const expressHandlerbars = require("express-handlebars");
const bodyParser = require("body-parser");

application.use(bodyParser.urlencoded({
    extended : true
}));

application.listen("3000"), ()=>{
    console.log("Server started");
};

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
