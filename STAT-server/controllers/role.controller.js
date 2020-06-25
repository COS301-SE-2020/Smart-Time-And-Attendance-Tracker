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
