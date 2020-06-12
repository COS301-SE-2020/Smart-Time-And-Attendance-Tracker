const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const UserModel = mongoose.model("User");
router.get("/", (req, res)=>{
    res.send("User controller");
});

router.post("/add", (req, res) => {
    
});

module.exports = router;
