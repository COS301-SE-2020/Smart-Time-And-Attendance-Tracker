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

describe("pass all cases- user a team leader and security admin", ()=>{

    before(function () {
        console.log("-------------------------------------------------------------------------------------------")
      });
    after(function () {
        console.log("-------------------------------------------------------------------------------------------")
      });

it(" adminr", (done) =>{
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


var team1ID;
var teamLength;
it("pass create a team - pass isTeamLeader", (done) =>{
            let data = {
                teamName:"team"+date,
            }
            chai.request('http://localhost:3000')
                 .post("/api/team/add")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    console.log(res.body)
                done(); 
                 })
        });



var role;
it("pass add a role - user not authenticated and pass-  isSecurityAdmin", (done) =>{
    let user = {
        role:"MOCHA chai"+date
    }
    chai.request('http://localhost:3000')
         .post("/api/role/addRole")
         .set("Authorization", "Bearer " + adminToken)
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
         .set("Authorization", "Bearer " + adminToken)
         .send(data)
         .end((err,res) => {

            console.log(res.body.message)
        done(); 
         })
});


});