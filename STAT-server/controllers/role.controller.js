const mongoose = require("mongoose");
const RoleModel = mongoose.model("Role");

module.exports.add = (req, res) => {   
    //RoleModel.countDocuments({}, function(err, totalCount) { //get id
    RoleModel.find({}, function(err, res1) {
       //= totalCount+1;
        //console.log("currentID=>  " + currentID);
        if(err) throw err;
        var currentID = (res1[0].ID) + 1;          
        var role = new RoleModel();
        role.ID = currentID;
        role.Role = req.body.role;
        role.save((err, doc) => {
            if(!err){
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
    }).sort({ ID: -1 });
};


module.exports.getRole = (req, res, next) => {
    console.log("getting roles  " + req.body.ID);
    RoleModel.findOne({ ID: req.body.ID},(err, result) => {
        if(err) 
        {
            return res.status(500).send({message: 'Internal Server Error'});
        }
        else if (!result)
        {
            return res.status(404).json({ status: false, message: 'Role record not found.' });
        }
        else if (result)
        {
            console.log("2");
            return res.status(200).json({ status: true, roles : result.Role});
        }
    });
}

