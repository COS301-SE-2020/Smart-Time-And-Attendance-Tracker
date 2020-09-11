let chai =require('chai')
let chaiHttp =require('chai-http');
const { gmail } = require('googleapis/build/src/apis/gmail');
//let server =require('../index')

require('../routes/index.router.js');

let should =chai.should()
let expect =chai.expect()

chai.use(chaiHttp)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     REMOVE START- -- -CREATES HELPER VARIABLES
////register user  - register
var date=Date.now();
var Name=date+'n';
var Surname=date+'s';
var user1Email=date+"@gmail.com";
var user1Password=date;
var PasswordConf=user1Password;
var user1Token;
var projectID;
var date= Date.now();
var task1 = "task1"+date
var task2= "task2"+date
var task1ID;
var adminToken;





/////get user1 name, email and id -getUnauthenticatedUsers
var user1ID;
describe("Role suite", ()=>{

    describe("add a new role and get role by id", ()=>{


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

        var role;

        it("add a role", (done) =>{
            let user = {
                role:"MOCHA chai"+date
            }
            chai.request('http://localhost:3000')
                 .post("/api/role/addRole")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(201);
                    res.body.should.have.property("role");
                    role=res.body.role.ID;
                    //console.log(res.body.role)
                done(); 
                 })
        });

        
       it("get a role using id ", (done) =>{
           
            chai.request('http://localhost:3000')
                 .get("/api/role/getRole")
                 .set("Authorization", "Bearer " + adminToken)
                 .query({ID:role})
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('role');
                done(); 
                 })
        });




        



    });
});