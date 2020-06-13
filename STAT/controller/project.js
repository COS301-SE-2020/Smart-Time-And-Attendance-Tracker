const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ProjectModel = mongoose.model("Project");
router.get("/", (req, res)=>{
    res.send("Project controller");
});


router.post("/add", (req, res) => {
    var project = new ProjectModel();
    project.ID = db.Project.find().Count()+1;
    project.OrganisationID = req.body.organisationID;
    project.ClientName = req.body.clientName;
    project.ProjectTitle = req.body.projectTitle;
    project.TotlaTime = 0;
    project.save((err, doc) => {
        if(!err){
            res.send("Created Project");
        }
        else{
            res.send("Error Occured");
        }
    })
});

module.exports = router;
