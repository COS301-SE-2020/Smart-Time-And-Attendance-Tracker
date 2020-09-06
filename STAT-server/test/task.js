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
describe("TASKS role", ()=>{

    describe("post, get, update and delete tasks", ()=>{


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

          ///create a project to get tasks
          it("Add a project", (done) =>{
            let data = {
                projectName: "testing"+date,
                dueDate: "2020/08/22",
                startDate:"2020/07/30",
                hourlyRate:10000,
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/add")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    projectID=res.body.projectID;
                done(); 
                 })
        });

 
        ////create first task and add a task to the project
        it("Add task to the project", (done) =>{
            let data = {
                projectID:projectID,
                projectName: "testing"+date,
                taskName:task1,
                dueDate: "2020/08/22",
                startDate:"2020/07/30",
                hourlyRate:10000,
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/addTask")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Task created and added to project');
                    task1ID=res.body.taskID;
                    //console.log(task1ID)
                done(); 
                 })
        });
      

        ////starts tracking a task
        it("Add task to the project", (done) =>{
            let data = {
                taskID:task1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/task/start")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Task status updated to "In Progress"');
                    
                done(); 
                 })
        });




        ////update a task
        it("update task name and monetaryValue", (done) =>{
            let data = {
                taskID:task1ID,
                monetaryValue: 1500,
                taskName:"changed task name"+date
            }
            chai.request('http://localhost:3000')
                 .post("/api/task/update")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Task successfully updated');
                    
                done(); 
                 })
        });



         ////mark task as complete
         it("mark task as complete", (done) =>{
            let data = {
                taskID:task1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/task/complete")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Task status updated to "Completed"');
                    
                done(); 
                 })
        });
        

        
        



    });
});