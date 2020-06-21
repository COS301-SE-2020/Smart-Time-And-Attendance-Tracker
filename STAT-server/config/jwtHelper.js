const jwt = require("jsonwebtoken");

module.exports.verifyJWTtoken = (req, res, next)=>
{
    var token; 
    if('authorization' in req.headers)
        token = req.headers["authorization"];

    if(!token)
        return res.status(403).send({auth: false, message: "No token provided"});
    else{
        jwr.verify(token, process.env.JWT_SECRET,
            (err, decoded)=> {
                if(err)
                    return res.status(500).send({auth: false, message: "Token authentication failed."});
                else{
                    req.ID = decoded.ID;
                    next();
                }
            })
    }

}