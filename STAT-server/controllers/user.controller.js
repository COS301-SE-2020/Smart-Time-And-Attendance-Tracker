
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const UserModel = mongoose.model("User");


module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err,user,info)=>{
        //error from passport
        if(err)
            return res.status(400).json(err);
        //registered user
        else if(user) 
        {
            return res.status(200).json({token: user.generateJWT(), message: 'Sign in successful.'});
        }
        //unknown user or wrong password
        else
            return res.status(404).json(info);
    })(req,res);

}


module.exports.register = (req, res, next) => {

    var user = new UserModel();
    if (req.body.password !== req.body.passwordConf) { //pass=passconfirm
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
                    user.save((err, doc) => {
                        if (!err){
                            return res.status(200).json({token: user.generateJWT(), message : 'Sign up successful.'});
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
    UserModel.findOne({ ID: req.ID },
        (err, user) => {
            if(err) throw err;
            else if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, roles : user.Role, message: 'Sign up successful.'});
        }
    );
    
}



