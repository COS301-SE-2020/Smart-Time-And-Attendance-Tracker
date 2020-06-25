const mongoose = require("mongoose");
const RoleModel = mongoose.model("Role");

module.exports.add = (req, res) => {
    RoleModel.countDocuments({}, function(err, totalCount) { //get id
        var  currentID = totalCount+1;
        var role = new RoleModel();
        role.ID = currentID;
        role.Role = req.body.role;
        role.save((err, doc) => {
            if(!err){
                res.send("Created Role " + currentID);
                return res.status(200).json({message: "Role created"});
            }
            else{
                if (err.code == 11000){
                    return res.status(422).json({message: "Role already exists."});
                }
                else{
                    return next(err);
                }
            }
        })
    });
};


module.exports.getRole = (req, res, next) => {
    console.log("getting roles  " + req.body.ID);
    RoleModel.findOne({ ID: req.body.ID},(err, result) => {

        if(err) 
        {
            console.log("h");
            throw err;
        }
        else if (!result)
        {
            console.log("h1");
            return res.status(404).json({ status: false, message: 'Role record not found.' });
        }
        else if (result)
        {
            console.log("2");
            return res.status(200).json({ status: true, roles : result.Role});
        }
    });
}

