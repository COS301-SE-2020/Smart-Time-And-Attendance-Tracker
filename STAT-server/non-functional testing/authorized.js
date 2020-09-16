let chai =require('chai')
let chaiHttp =require('chai-http');
//let server =require('../index')


let should =chai.should()
let expect =chai.expect()

chai.use(chaiHttp)



var date=Date.now();
var Name=date+'n';
var Surname=date+'s';
var user1Email=date+"@gmail.com";
var user1Password=date;
var PasswordConf=user1Password;
var user1Token;

describe("New Anauthorized user tests", ()=>{

    before(function () {
        console.log("-------------------------------------------------------------------------------------------")
      });
    after(function () {
        console.log("-------------------------------------------------------------------------------------------")
      });

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



it("helper adminr", (done) =>{
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
it("get unauthenticated users", (done) =>{
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









var team1ID;
var teamLength;
it("fail create a team - fail isTeamLeader", (done) =>{
            let data = {
                teamName:"team"+date,
            }
            chai.request('http://localhost:3000')
                 .post("/api/team/add")
                 .set("Authorization", "Bearer " + user1Token)
                 .send(data)
                 .end((err,res) => {
                    console.log(res.body)
                done(); 
                 })
        });



var role;
it("fail add a role - user not authenticated and fail-  isSecurityAdmin", (done) =>{
    let user = {
        role:"MOCHA chai"+date
    }
    chai.request('http://localhost:3000')
         .post("/api/role/addRole")
         .set("Authorization", "Bearer " + user1Token)
         .send(user)
         .end((err,res) => {
            console.log(res.body)
        done(); 
         })
});

it("pass adding a time entry - pass isAuthenticated", (done) =>{
    let data = {
            taskName:"mocha",
            projectName:"testing"+date,
            taskName:"demo4",
             description : "chai tests "+date,
             device : "Browser",
             activeTime:2,
             date: date,
             startTime:date,
             endTime: Date.now()
    }
    chai.request('http://localhost:3000')
         .post("/api/userTimeEntry/addTimeEntry")
         .set("Authorization", "Bearer " + user1Token)
         .send(data)
         .end((err,res) => {

            console.log(res.body.message)
        done(); 
         })
});


});