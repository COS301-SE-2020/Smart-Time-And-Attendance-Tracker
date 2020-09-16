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

describe("New Unauthorized user tests", ()=>{

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
it("fail add a role - user not authenticated and not Security Admin", (done) =>{
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

it("Fail adding a time entry -", (done) =>{
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

            console.log(res.body)
        done(); 
         })
});


});