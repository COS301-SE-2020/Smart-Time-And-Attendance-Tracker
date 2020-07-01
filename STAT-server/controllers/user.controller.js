
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const UserModel = mongoose.model("User");
const request = require('request');

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err,user,info)=>{
        //error from passport
        if(err)
            return res.status(400).json(err);
        //registered user
        else if(user) 
        {
            return res.status(200).json({token: user.generateJWT(), message :"Sign in successful."});
        }
        //unknown user or wrong password
        else
            return res.status(404).json(info);
    })(req,res);

}


module.exports.register = (req, res, next) => {
    var user = new UserModel();
    if(!( req.body.name &&  req.body.surname && req.body.email && req.body.password && req.body.passwordConf)) 
    {
        return res.status(400).send({message: "Missing credentials."});
    }
    else if (req.body.password !== req.body.passwordConf) { //pass=passconfirm
        return res.status(400).send({message: "Passwords do not match."});
    }
    else{
        UserModel.countDocuments({}, function(err, totalCount) { //get id
            var  currentID = totalCount+1;
            user.ID = currentID;
    
            UserModel.findOne({ Email: req.body.email }, function(err, cons) { //check email duplicates
                if (err) throw err;
                if (cons){
                    return res.status(422).send({message: 'User already exists.'});
                }
                else{
                    user.Name = req.body.name;
                    user.Surname = req.body.surname;
                    user.Email = req.body.email.toLowerCase();
                    user.Password = req.body.password;
                    user.Role = [5];  
                    user.Authenticate = false;
                    user.save((err, doc) => {
                        if (!err){
                            return res.status(200).json({token: user.generateJWT(), message :"Sign up successful."});
                        }
                        else {
                            if (err.code == 11000){
                                res.status(422).send({message: 'User already exists.'});
                            }else{
                                return next(err);
                            }
                        }
                    });
    
                }
    
            })
            
       });
    }
}
    

module.exports.getRoles = (req, res, next) => {
    UserModel.findOne({ ID: req.ID},(err, result) => {
        if (err) 
            return res.status(500).send({message: 'Internal Server Error'});
        else if (!result)
            return res.status(404).json({ status: false, message: 'User record not found.' });
        else 
        {
            var rolesOfUser = [];
            var i=0, done = false;
            for(i=0; i<result.Role.length; i++)
            {
                request({
                    method: 'POST',
                    url: 'http://127.0.0.1:3000' + '/api/role/getRole',
                    body: {
                        ID:  result.Role[i]
                    },
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        console.error(error)
                        return
                    }
                    else if(response.statusCode == 200)
                    {
                        rolesOfUser.push(response.body.role);
                        if(rolesOfUser.length == result.Role.length)
                        {
                            return res.status(200).json({ status: true, roles : rolesOfUser, authenticate: req.Authenticate});
                        }
                    }
                });
            }    
        }
    });
    

    /*UserModel.findOne({ ID: req.ID },
        (err, user) => {
            if(err) throw err;
            else if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, roles : user.Role, message: 'Sign up successful.'});
        }
    );*/
}



