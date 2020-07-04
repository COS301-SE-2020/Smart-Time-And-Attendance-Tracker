
module.exports.isSecurityAdmin = (req, res, next) => {
    console.log(req.ID);
    if(req.Roles.includes(3)) 
        next();
    else
        return res.status(403).json({ message: "Access denied"});
    
}

module.exports.isAuthenticated = (req, res, next) => {
    console.log(req.ID);
    if(req.Authenticate == true) 
        next();
    else
        return res.status(403).json({ message: "Not authenticated"});
    
}