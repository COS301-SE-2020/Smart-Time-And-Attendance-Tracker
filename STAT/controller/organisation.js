const express = require("express");
const router = express.Router();

const OrganisationModel = mongoose.model("Organisation");
router.get("/", (req, res)=>{
    res.send("Organisation controller");
});


router.post("/add", (req, res) => {
    var organisation = new OrganisationModel();
    organisation.ID = db.Organisation.find().Count()+1;
    organisation.OrganisationName = req.body.organisationName;
    organisation.SystemAdminstrator = [];
    organisation.SecurityAdminstrator = [];
    organisation.DataAnalyst = [];
    organisation.save((err, doc) => {
        if(!err){
            res.send("Created Organisation");
        }
        else{
            res.send("Error Occured");
        }
    })
});

module.exports = router;
