let chai =require('chai')
let chaiHttp =require('chai-http');

let should =chai.should()
let expect =chai.expect()

chai.use(chaiHttp)
const request = require("supertest");
////trial 1
/*
const index = require("../routes/index.router");
const request = require("supertest");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use("/", index);  
*/
///require ('project.js')


var server = require ('../index.js'),
    assert = require ('assert'),
    http = require ('http');
var port = 8085;

describe('server', function () {

  /* before(function () {
       server.listen();
    });

    after(function () {
        server.close();
    }); */

    describe('Server status and Message', function () {
/*
      it('status response should be equal 200', function (done) {
            http.get('http://127.0.0.1:3000/', function (response) {
                  //assert.equal(response.statusCode, 200);
                  console.log(response.statusCode )
                  done();
            });
       }); 
*/

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



    });




});



/*





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
describe("CREATE A USER, LOGIN ADMIN, CREATE PROJECT, CREATE TASKS", ()=>{

    describe("this suit creates helper variables for timeentries testing", ()=>{


        it("helper user", (done) =>{
            let user = {
                name:Name,
                surname:Surname,
                email: user1Email,
                password: user1Password,
                passwordConf:PasswordConf
            }
            request(app)
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


    

        
    });
});
*/


