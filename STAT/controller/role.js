const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const RoleModel = mongoose.model("Role");
router.get("/", (req, res)=>{
    res.send("Role controller");
});

router.post("/add", (req, res) => {
    var role = new RoleModel();
    role.ID = db.Role.find().Count()+1;
    role.Role = req.body.role;
    role.save((err, doc) => {
        if(!err){
            res.send("Created Role");
        }
        else{
            res.send("Error Occured");
        }
    })
});

module.exports = router;
