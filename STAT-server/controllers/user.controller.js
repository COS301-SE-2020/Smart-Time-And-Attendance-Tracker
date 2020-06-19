
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const UserModel = mongoose.model("User");


/*router.post("/api/register", (req, res) => { ///missing validations - 
    console.log(req);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.body.password !== req.body.passwordConf) {
        var errors = new Error('Passwords do not match.');
        errors.status = 400;
        errors.name = 'Passwords do not match.';
        res.send(errors);
        return;
    }
    UserModel.findOne({"Email": req.body.email},
    (err, user)=> {
        if(user)
        {
            var errors = new Error('An account is already registered with that email.');
            errors.status = 400;
            errors.name = 'An account is already registered with that email.';
            res.send(errors);
            return;
        }
        else{}});
    if (req.body.email && req.body.password && req.body.passwordConf && req.body.name &&
        req.body.surname )
        
        {  
            var user = new UserModel();
            user.ID =Math.floor(Math.random() * Math.floor(1000));; //db.User.find().Count()+1;
           // user.Password = req.body.password;
            user.Name = req.body.name;
            user.Surname = req.body.surname;
            user.Email = req.body.email;
            user.Role = [5];

            bcrypt.hash(req.body.password, 10, function (err, hash){
                if (err) {
                    var errors = new Error('Password not Hashed.');
                    errors.status = 400;
                    errors.name = 'Something went wrong.';
                    res.send(errors);
                }
                 user.Password = hash;
                 user.save((err, doc) => {
                    if(!err){
                    return res.status(200).json({"token": user.generateJWT(), "roles": user.Role});
                    }
                    else{
                        res.send(err);
                    }
                })
            })
    }
    else{
        var errors = new Error('All fields required.');
        errors.status = 400;
        errors.name = 'All fields required.';
         res.send(errors);
    }
});


router.post("/api/update", (req, res) => {
    res.send("Under Construction");
});*/

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
    
