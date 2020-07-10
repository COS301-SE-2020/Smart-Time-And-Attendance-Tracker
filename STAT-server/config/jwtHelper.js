const jwt = require("jsonwebtoken");

module.exports.verifyJWTtoken = (req, res, next)=>
{
    var token;
    if('authorization' in req.headers)
        token = req.headers["authorization"].split(' ')[1];
    if(!token)
        return res.status(403).send({ message: "No token provided"});
    else{
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded)=> {
                if(err)
                    return res.status(500).send({message: 'Internal Server Error: ' + err});
                else{
                    req.ID = decoded.id;
                    //req.Authenticate = decoded.authenticate;
                    //req.Roles = decoded.roles;
                    next();
                }
            })
    }

}