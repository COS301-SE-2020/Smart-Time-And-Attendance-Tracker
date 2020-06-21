
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const UserModel = mongoose.model("User");


module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    passport.authenticate('local', (err,user,info)=>{
        //error from passport
        if(err)
            return res.status(400).json(err);
        //registered user
        else if(user) 
        {
            return res.status(200).json({"token": user.generateJWT(), "roles": user.Role});
        }
        //unknown user or wrong password
        else
            return res.status(404).json(info);
    })(req,res);

}
    
module.exports.register = (req, res, next) => {

    var user = new UserModel();
    ////change this to read db size
    var currentID = Math.floor(Math.random() * Math.floor(1000));
    
   /* do
    {
        UserModel.exists({ ID : currentID }, function(err, result) {
        if (err) {
            res.send(err);
        } 
        else if(result){
            currentID = Math.floor(Math.random() * Math.floor(1000));
        }
        else break;
        });
    }while(true);

    /*while(db.User.findOne({ID:currentID}) != 0)
    {
        currentID = Math.floor(Math.random() * Math.floor(1000));
    }*/
    user.ID = currentID;
    user.Name = req.body.name;
    user.Surname = req.body.surname;
    user.Email = req.body.email;
    user.Password = req.body.password;
    user.Role = [5];  

    user.save((err, doc) => {
        if (!err){
            return res.status(200).json({"token": user.generateJWT(), "roles": user.Role});
            //res.send(doc);
        }
        else {
            if (err.code == 11000){
                    res.status(422).send({message : 'An account is already registered with that email.'});
            }else{
                return next(err);
            }
        }
    });

}

module.exports.getRoles = (req, res, next) => {
    // call for passport authentication
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    passport.authenticate('local', (err,user,info)=>{
        //error from passport
        if(err)
            return res.status(400).json(err);
        //registered user
        else if(user) 
        {
            return res.status(200).json({"roles": user.Role});
        }
        //unknown user or wrong password
        else
            return res.status(404).json(info);
    })(req,res);

}