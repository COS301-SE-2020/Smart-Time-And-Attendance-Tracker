let chai =require('chai')
let chaiHttp =require('chai-http');
const { gmail } = require('googleapis/build/src/apis/gmail');
//let server =require('../index')


let should =chai.should()
let expect =chai.expect()

chai.use(chaiHttp)



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     REMOVE START
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
    });
});


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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// REMOVE END

///////////////////////////////////////////////////////////////////////////////////////////////  Project FUNCTIONS  /////////////////////////////////////////////////////////////////////////////////////////////////
//******************************************************************************************
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var projectID;
var date= Date.now();
var task1 = "task1"+date
var task2= "task2"+date
var task1ID;
describe("PROJECT endpoints", ()=>{
    describe("POST, GET and DELETE api/project/", ()=>{


        ///add a project -project
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

 
        ////add a task to the project
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

        
        ///////mark as uncomplete
        it("mark project as uncomplete", (done) =>{
            let data = {
                projectID:projectID,
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/uncomplete")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Project marked as uncompleted');
                done(); 
                 })
        });
        
         ///////get all projects
         it("get all projects; check for projectID="+projectID, (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/project/getProjects")
                 .set("Authorization", "Bearer " + adminToken)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    var l=res.body.projects.length;
                    res.body.projects[l-1].ID.should.be.eq(projectID) /// last elemet in the arrys = local project id
                    //console.log(res.body.projects[l-1].ID + " "+ projectID)
                done(); 
                 })
        });
        
         ///////update details
         it("update project details", (done) =>{
            let data = {
                projectID:projectID,
                hourlyRate:450
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/update")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    /// console.log(res.body)
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Project successfully updated') 
                done(); 
                 })
        });


          //////add a user to a project
          it("add user1 to a project", (done) =>{
            let data = {
                projectID:projectID,
                userID:user1ID,
                userRole:"code base manager"
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/addMember")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('User successfully added to project') 
                    res.body.projectID.should.be.eq(projectID) 
                done(); 
                 })
        });

        //add role to a user in the team
        it("add role to a user in the team", (done) =>{
            let data = {
                projectID:projectID,
                userID:user1ID,
                userRole:"scram master"
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/changeRole")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Member role updated successfully') 
                    res.body.projectID.should.be.eq(projectID) 
                done(); 
                 })
        });

          //remove user from project
          it("delete user1 from project", (done) =>{
            let data = {
                projectID:projectID,
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/removeMember")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('User successfully removed from project') 
                done(); 
                 })
        });
        

        ////create a new team to be added to project
        var teamProject
        it("create team to be added to project", (done) =>{
            let data = {
                teamName:"teamProject"+date,
            }
            chai.request('http://localhost:3000')
                 .post("/api/team/add")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    //console.log(res.body)
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Team created');
                    teamProject=res.body.teamID;
                    
                done(); 
                 })
        });


         //FAIL add a team to the project - cant add an empty team 
         it("Fail add a team to the project", (done) =>{
            let data = {
                projectID:projectID,
                teamID:teamProject

            }
            chai.request('http://localhost:3000')
                 .post("/api/project/addTeam")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(404);
                    res.body.message.should.be.eq('Team not found') 
                done(); 
                 })
        });


          ///////add member to team
          it("add member to team ", (done) =>{
            let data = {
                teamID:teamProject,
                userID:user1ID,
                userRole:"coder",
                teamName:"coolerNAme"+date
            }
            chai.request('http://localhost:3000')
                 .post("/api/team/addTeamMember")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Member successfully added to team');
                done(); 
                 })
        });


         //add a team to the project - use teamProject
         it("pass add a team to the project", (done) =>{
            let data = {
                projectID:projectID,
                teamID:teamProject

            }
            chai.request('http://localhost:3000')
                 .post("/api/project/addTeam")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                     res.body.message.should.be.eq('Team successfully added to project') 
                done(); 
                 })
        });

        //delete all users from a team
        it("remove all users from project", (done) =>{
            let data = {
                projectID:projectID,
                teamID:teamProject
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/clearMembers")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                     res.body.message.should.be.eq('All members removed from project') 
                done(); 
                 })
        });

        
        //mark project as completed
        it("mark project as completed", (done) =>{
            let data = {
                projectID:projectID
            }
            chai.request('http://localhost:3000')
                 .post("/api/project/complete")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                     res.body.message.should.be.eq('Project marked as completed') 
                done(); 
                 })
        });


        
        ////delete a project
        it("delete a project - using the teamID ", (done) =>{
            chai.request('http://localhost:3000')
                 .delete("/api/project")
                 .set("Authorization", "Bearer " + adminToken)
                 .query({projectID: projectID}) 
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Project successfully deleted ');
                    
                done(); 
                 })
        });



        
    });
});

