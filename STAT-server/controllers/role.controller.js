const mongoose = require("mongoose");
const RoleModel = mongoose.model("Role");
var request = require('request');


module.exports.add = (req, res) => {  
    request({
        method: 'POST',
        url: 'http://127.0.0.1:3000' + '/api/user/getRoles',
        body: {
        token: req.body.token
       },
       json: true
       }, (error, response, body) => {
        if (error) {
            console.error(error)
            return
        }
        else if(response.statusCode == 200 && response.body.roles.includes("Security Administrator"))
        {
            RoleModel.find({}, function(err, allDocuments) {
                if(err) return res.status(500).json({message: "Internal Server Error"});
                var currentID = (allDocuments[0].ID) + 1;          
                var role = new RoleModel();
                role.ID = currentID;
                role.Role = req.body.role;
                role.save((err, doc) => {
                    if(!err)
                        return res.status(200).json({message: "Role created"});
                    
                    else{
                        if (err.code == 11000){
                            return res.status(422).json({message: "Role already exists."});
                        }
                        else{
                            return next(err);
                        }
                    }
                })
            }).sort({ ID: -1 });    //sorting all documents in descinding order of ID
        }
        else if(response.statusCode == 200 && !response.body.roles.includes("Security Administrator")) {
            return res.status(403).json({message: "Access forbidden"});
        }
    });        
};


module.exports.getRole = (req, res, next) => {
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
            return res.status(200).json({ status: true, role : result.Role});
        }
    });
}

