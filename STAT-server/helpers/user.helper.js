
module.exports.isSecurityAdmin = (req, res, next) => {
    if(req.Roles.includes(3)) 
        next();
    else
        return res.status(403).json({ message: "Access denied"});
    
}

module.exports.isAuthenticated = (req, res, next) => {
    if(req.Authenticate == true) 
        next();
    else
        return res.status(403).json({ message: "Not authenticated"});
    
}