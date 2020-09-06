let chai =require('chai')
let chaiHttp =require('chai-http');
const { gmail } = require('googleapis/build/src/apis/gmail');
//let server =require('../index')


let should =chai.should()
let expect =chai.expect()

chai.use(chaiHttp)


////register user  - register
var date=Date.now();
var Name=date+'n';
var Surname=date+'s';
var user1Email=date+"@gmail.com";
var user1Password=date;
var PasswordConf=user1Password;
var user1Token;



describe("USER endpoints", ()=>{
    describe("POST api/user/register", ()=>{
        it("register a user", (done) =>{
            let user = {
                name:Name,
                surname:Surname,
                email: user1Email,
                password: user1Password,
                passwordConf:PasswordConf
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/register")
                 .send(user)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(201);
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                    user1Token=res.body.token;
                done(); 
                 })
        });


        ///login user  - login
        var adminToken;

        it("login a user", (done) =>{
            let user = {
                email: "admin@gmail.com",
                password: "12345678"
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/login")
                 .send(user)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                    adminToken=res.body.token;
                done(); 
                 })
        });


/////get user1 name, email and id -getUnauthenticatedUsers
        var user1ID;
        it("get unauthenticated users; last user name="+Name+" email="+user1Email, (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getUnauthenticatedUsers")
                 .set("Authorization", "Bearer " + adminToken)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    var l =res.body.unauthenticatedUsers.length-1;
                    var u=res.body.unauthenticatedUsers;
                    res.body.unauthenticatedUsers.should.be.an('array');
                    res.body.unauthenticatedUsers[l].name.should.be.eq(Name); ///last user in the arry must be the user we registered
                    res.body.unauthenticatedUsers[l].email.should.be.eq(user1Email);
                    user1ID=res.body.unauthenticatedUsers[l].ID; ///store user id for later use
                    //console.log("user = "+user1ID)
                done(); 
                 })
        });
 


/////GET namw
var user1ID;
        it("get  users name ; name="+Name, (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getName")
                 .set("Authorization", "Bearer " + user1Token)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.name.should.be.eq(Name); 
                done(); 
                 })
        });



/////get user1 roles - getRoles

        it("get user1 roles", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getRoles")
                 .set("Authorization", "Bearer " + user1Token)
                 .query({ID: user1ID}) 
                 .end((err,res) => {
                    res.body.roles.should.be.an('array'); 
                    res.should.have.status(200);
                    res.body.roles[0].should.be.eq('General Team Member'); /// array with one element equal to "General Team Member"
                    
                done(); 
                 })
        });



///get get all users -getAllUsers

        it("get all users", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getAllUsers")
                 .set("Authorization", "Bearer " + adminToken)
                 .end((err,res) => {
                    res.body.users.should.be.an('array'); 
                    res.should.have.status(200);
                    //console.log(res.body)
                    
                done(); 
                 })
        });



///authenticate user1 - authenticate

        it("authenticate user1 ", (done) =>{
            let user = {
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/authenticateUser")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('User authenticated'); ///returned string = 'User authenticated'
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
                done(); 
                 })
        });


///check if user is authenticated - isAuthenticated

        it("check if user is authenticated ", (done) =>{
            let user = {
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .get("/api/user/isAuthenticated")
                 .set("Authorization", "Bearer " + user1Token)
                 .end((err,res) => {
                    res.body.authenticated.should.be.eq(true); ///returned item is true
                    res.should.have.status(200);
                    //console.log(res.body)
                done(); 
                 })
        });

///get all projects a user is assigned - getProjects

        it("get all projects a user is assigned", (done) =>{
            let user = {
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .get("/api/user/getProjects")
                 .set("Authorization", "Bearer " + user1Token)
                 .end((err,res) => {
                    res.body.message.should.be.eq('User is not assigned to any projects'); //// user not assigned any projects yet
                    res.should.have.status(404);
                    //console.log(res.body)
                done(); 
                 })
        });



///fail editing a user details(not a security admin) - editUser
////pass editing on second requests
       Name='changed name'+date;
        it("FAIL Access denied - edit a user details; name", (done) =>{
            let user = {
                userID: user1ID,
                name:'changed name'+date
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/editUser")
                 .set("Authorization", "Bearer " + user1Token)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('Access denied'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(403);
            
                done(); 
                 })
        });


        it("pass- edit a user details by the security admin; name", (done) =>{
            let user = {
                userID: user1ID,
                name:'changed name'+date
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/editUser")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('User successfully updated'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
                    
                done(); 
                 })
        });


///add a user rold 
////pass editing on second requests
      Name='changed name'+date;
        it("add a user Role", (done) =>{
            let user = {
                userID: user1ID,
                userRole:"System Administrator"
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/addRole")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('Role successfully added'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
            
                done(); 
                 })
        });


        it("remove user roles", (done) =>{
            let user = {
                userID: user1ID,
                userRole:"General Team Member"
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/removeRole")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Role successfully removed'); 
                done(); 
                 })
        });
 

        it("get user1 roles", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getRoles")
                 .set("Authorization", "Bearer " + user1Token) 
                 .query({ID: user1ID}) 
                 .end((err,res) => {
                    res.body.roles.should.be.an('array'); 
                    res.should.have.status(200);
                    ///res.body.roles[0].should.be.eq('General Team Member'); 
                    res.body.roles[0].should.be.eq('System Administrator'); 
                    
                done(); 
                 })
        });


        it("remove user from organaisation", (done) =>{
            let user = {
                userID: user1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/removeUser")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('User removed'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
            
                done(); 
                 })
        });


    
    
 

});







 });



/*

///login user  - login
var adminToken;
describe("USER endpoints", ()=>{
    describe("POST api/user/login", ()=>{
        it("login a user", (done) =>{
            let user = {
                email: "admin@gmail.com",
                password: "12345678"
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/login")
                 .send(user)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.should.have.property('token');
                    adminToken=res.body.token;
                done(); 
                 })
        });
    });
});


/////get user1 name, email and id -getUnauthenticatedUsers
var user1ID;
describe("USER endpoints", ()=>{
    describe("GET api/user/getUnauthenticatedUsers", ()=>{
        it("get unauthenticated users; last user name="+Name+" email="+user1Email, (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getUnauthenticatedUsers")
                 .set("Authorization", "Bearer " + adminToken)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    var l =res.body.unauthenticatedUsers.length-1;
                    var u=res.body.unauthenticatedUsers;
                    res.body.unauthenticatedUsers.should.be.an('array');
                    res.body.unauthenticatedUsers[l].name.should.be.eq(Name); ///last user in the arry must be the user we registered
                    res.body.unauthenticatedUsers[l].email.should.be.eq(user1Email);
                    user1ID=res.body.unauthenticatedUsers[l].ID; ///store user id for later use
                    //console.log("user = "+user1ID)
                done(); 
                 })
        });
    });
});


/////GET namw
var user1ID;
describe("USER endpoints", ()=>{
    describe("GET api/user/getUnauthenticatedUsers", ()=>{
        it("get  users name ; name="+Name, (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getName")
                 .set("Authorization", "Bearer " + user1Token)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.name.should.be.eq(Name); 
                done(); 
                 })
        });
    });
});



/////get user1 roles - getRoles
describe("USER endpoints", ()=>{
    describe("GET api/user/getRoles = General Team Member", ()=>{
        it("get user1 roles", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getRoles")
                 .set("Authorization", "Bearer " + user1Token)
                 .query({ID: user1ID}) 
                 .end((err,res) => {
                    res.body.roles.should.be.an('array'); 
                    res.should.have.status(200);
                    res.body.roles[0].should.be.eq('General Team Member'); /// array with one element equal to "General Team Member"
                    
                done(); 
                 })
        });
    });
});



///get get all users -getAllUsers
describe("USER endpoints", ()=>{
    describe("GET api/user/getAllUsers", ()=>{
        it("get all users", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getAllUsers")
                 .set("Authorization", "Bearer " + adminToken)
                 .end((err,res) => {
                    res.body.users.should.be.an('array'); 
                    res.should.have.status(200);
                    //console.log(res.body)
                    
                done(); 
                 })
        });
    });
});



///authenticate user1 - authenticate
describe("USER endpoints", ()=>{
    describe("POST api/user/authenticateUser ", ()=>{
        it("authenticate user1 ", (done) =>{
            let user = {
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/authenticateUser")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('User authenticated'); ///returned string = 'User authenticated'
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
                done(); 
                 })
        });
    });
});



///check if user is authenticated - isAuthenticated
describe("USER endpoints", ()=>{
    describe("POST api/user/isAuthenticated ", ()=>{
        it("check if user is authenticated ", (done) =>{
            let user = {
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .get("/api/user/isAuthenticated")
                 .set("Authorization", "Bearer " + user1Token)
                 .end((err,res) => {
                    res.body.authenticated.should.be.eq(true); ///returned item is true
                    res.should.have.status(200);
                    //console.log(res.body)
                done(); 
                 })
        });
    });
});



///get all projects a user is assigned - getProjects
describe("USER endpoints", ()=>{
    describe("POST api/user/getProjects ", ()=>{
        it("get all projects a user is assigned", (done) =>{
            let user = {
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .get("/api/user/getProjects")
                 .set("Authorization", "Bearer " + user1Token)
                 .end((err,res) => {
                    res.body.message.should.be.eq('User is not assigned to any projects'); //// user not assigned any projects yet
                    res.should.have.status(404);
                    //console.log(res.body)
                done(); 
                 })
        });
    });
});



///fail editing a user details(not a security admin) - editUser
////pass editing on second requests
Name='changed name'+date;
describe("USER endpoints", ()=>{
    describe("POST api/user/editUser ", ()=>{
        it("FAIL Access denied - edit a user details; name", (done) =>{
            let user = {
                userID: user1ID,
                name:'changed name'+date
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/editUser")
                 .set("Authorization", "Bearer " + user1Token)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('Access denied'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(403);
            
                done(); 
                 })
        });
        it("pass- edit a user details by the security admin; name", (done) =>{
            let user = {
                userID: user1ID,
                name:'changed name'+date
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/editUser")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('User successfully updated'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
                    
                done(); 
                 })
        });

    });
});


///add a user rold 
////pass editing on second requests
Name='changed name'+date;
describe("USER endpoints", ()=>{
    describe("POST api/user/addRole ", ()=>{
        it("add a user Role", (done) =>{
            let user = {
                userID: user1ID,
                userRole:"System Administrator"
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/addRole")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('Role successfully added'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
            
                done(); 
                 })
        });

    });

    describe("GET api/user/removeRole - remove  General Team Member", ()=>{
        it("remove user roles", (done) =>{
            let user = {
                userID: user1ID,
                userRole:"General Team Member"
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/removeRole")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Role successfully removed'); 
                done(); 
                 })
        });
    });


    describe("GET api/user/getRoles =  System Administrator", ()=>{
        it("get user1 roles", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/user/getRoles")
                 .set("Authorization", "Bearer " + user1Token) 
                 .query({ID: user1ID}) 
                 .end((err,res) => {
                    res.body.roles.should.be.an('array'); 
                    res.should.have.status(200);
                    ///res.body.roles[0].should.be.eq('General Team Member'); 
                    res.body.roles[0].should.be.eq('System Administrator'); 
                    
                done(); 
                 })
        });


        it("remove user from organaisation", (done) =>{
            let user = {
                userID: user1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/removeUser")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('User removed'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
            
                done(); 
                 })
        });


    });

    
    
 

});


*/