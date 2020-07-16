const mongoose = require("mongoose");
const UserModel = mongoose.model("User");

module.exports.isSecurityAdmin = (req, res, next) => {

    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Role.includes(3))
                next();
            else
                return res.status(403).json({ message: "Access denied"});
        }
    });
   /* if(req.Roles.includes(3)) 
        next();
    else
        return res.status(403).json({ message: "Access denied"});*/
    
}
module.exports.isTeamLead = (req, res, next) => {

    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Role.includes(4))
                next();
            else
                return res.status(403).json({ message: "Access denied"});
        }
    });  
}

module.exports.isAuthenticated = (req, res, next) => {

    UserModel.findOne({ _id: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error: ' + error});
        else if (!result)
            return res.status(404).json({ message: 'User not found' });
        
        else
        {
            if(result.Authenticate == true)
                next();
            else
                return res.status(403).json({ message: "Not authenticated"});
        }
    });

    /*if(req.Authenticate == true) 
        next();
    else
        return res.status(403).json({ message: "Not authenticated"});*/
    
}