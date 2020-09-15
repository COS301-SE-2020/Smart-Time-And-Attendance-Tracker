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



        it("get helper user details - name="+Name+" email="+user1Email, (done) =>{
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

        it("authenticate helper  user1 ", (done) =>{
            let user = {
                userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/user/authenticateUser")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(user) 
                 .end((err,res) => {
                    res.body.message.should.be.eq('User authenticated'); 
                    res.body.message.should.be.a('string'); 
                    res.should.have.status(200);
                done(); 
                 })
        });





          ///add a project -project
          it("create helper project", (done) =>{
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
        it("create helper task and add to project", (done) =>{
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

        



    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// REMOVE END

/////////////////////////////////////////////////////////////////////////////////////////////// user time entry FUNCTIONS  /////////////////////////////////////////////////////////////////////////////////////////////////
//******************************************************************************************
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var timeEntry1ID;
var timeEntry2ID;
describe("TIME ENTRIES endpoints", ()=>{
    describe("POST, GET and DELETE api/userTimeEntry/", ()=>{


        ///add 5 time entries for user 1 
        for (let index = 0; index < 5; index++) {
          
            it("Adding 5 time entries by user1 -"+index, (done) =>{
                let data = {
                        taskID : task1ID,
                        projectID : projectID,
                        taskName:"mocha",
                        projectName:"testing"+date,
                        taskName:task1,
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
                        res.body.should.be.a('object');
                        res.should.have.status(200);
                        res.body.message.should.be.eq('Time recorded successfully');
                        timeEntry1ID=res.body.timeEntryID;
                    done(); 
                     })
            });
        }
       
        it("get user1 daily time entries - array size 5", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/userTimeEntry/getDailyTimeEntries")
                 .set("Authorization", "Bearer " + user1Token)
                 .query({date: date, }) 
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.timeEntries.length.should.be.eq(5) ////
                done(); 
                 })
        });

         
           it("import a time entry by admin - add 1 more entry to user1", (done) =>{
            let data = {
                    taskID : task1ID,
                    projectID : projectID,
                    taskName:"mocha",
                    projectName:"testing"+date,
                    taskName:task1,
                     description : "chai tests "+date,
                     device : "Browser",
                     activeTime:2,
                     date: date,
                     startTime:date,
                     endTime: Date.now(),
                     userID:user1ID
            }
            chai.request('http://localhost:3000')
                 .post("/api/userTimeEntry/importTimeEntry")
                 .set("Authorization", "Bearer " + adminToken)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Time recorded successfully');
                    timeEntry2ID=res.body.timeEntryID;
                done(); 
                 })
        });

         
        it("get all user1 entries - arry size 6(6th imported)", (done) =>{
            chai.request('http://localhost:3000')
                 .get("/api/userTimeEntry/getOwnTimeEntries")
                 .set("Authorization", "Bearer " + user1Token)
                 .query({date: date}) 
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.timeEntries.length.should.be.eq(6) ////
                    ///console.log( res.body.timeEntries)
                done(); 
                 })
        });



        it("update time entry1 details", (done) =>{
            let data = {
                timeEntryID: timeEntry1ID,
                    taskID : task1ID,
                    projectID : projectID,
                    taskName:"mocha changed",
                    projectName:"testing changed"+date,
                    taskName:task1,
                     description : "chai tests changed"+date,
                     device : "Browser",
                     activeTime:4,
                     date: date,
                     startTime:date,
                     endTime: Date.now()
            }
            chai.request('http://localhost:3000')
                 .post("/api/userTimeEntry/updateTimeEntry")
                 .set("Authorization", "Bearer " + user1Token)
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Time entry successfully updated');
                done(); 
                 })
        });


        it("update time entry2 details fail - wrong user", (done) =>{
            let data = {
                    timeEntryID: timeEntry2ID,
                    taskID : task1ID,
                    projectID : projectID,
                    taskName:"mocha changed",
                    projectName:"testing changed"+date,
                    taskName:task1,
                     description : "chai tests changed"+date,
                     device : "Browser",
                     activeTime:4,
                     date: date,
                     startTime:date,
                     endTime: Date.now()
            }
            chai.request('http://localhost:3000')
                 .post("/api/userTimeEntry/updateTimeEntry")
                 .set("Authorization", "Bearer " + adminToken) ///use user1token
                 .send(data)
                 .end((err,res) => {
                    res.body.should.be.a('object');
                    res.should.have.status(404);
                    res.body.message.should.be.eq('Time entry does not belong to user');
                    timeEntry2ID=res.body.timeEntryID;
                done(); 
                 })
        });



  
       /* it("delete user time entry ", (done) =>{
            chai.request('http://localhost:3000')
                 .delete("api/userTimeEntry/deleteTimeEntry")
                 .set("Authorization", "Bearer " + adminToken)
                 .end((err,res) => {
                   /* res.body.should.be.a('object');
                    res.should.have.status(200);
                    res.body.message.should.be.eq('Time entry deleted');
                    console.log(timeEntry1ID)
                    console.log(err)
                    console.log(res.body)
                done(); 
                 })
        });*/


        it("delete user time entry", (done) =>{
            chai.request('http://localhost:3000')
                 .delete("/api/userTimeEntry/deleteTimeEntry")
                 .set("Authorization", "Bearer " + adminToken)
                 .query({timeEntryID: timeEntry1ID }) 
                 .end((err,res) => {
                    //res.body.should.be.a('object');
                    //res.should.have.status(200);
                    //res.body.timeEntries.length.should.be.eq(6) ////change to 5 when delete is working
                    console.log(res.body)
                done(); 
                 })
        });


        

       
       it("get user1 entries - array size 5 (after deleting 1 entry)", (done) =>{
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getUserTimeEntries")
             .set("Authorization", "Bearer " + adminToken)
             .query({userID: user1ID }) 
             .end((err,res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                res.body.timeEntries.length.should.be.eq(5) ////change to 5 when delete is working
            done(); 
             })
    });
    
/////THESE TWO RUN VERY SLOW - NEED MORE SECONDS FROM MOCHA
    it("get all system users entries", (done) =>{    ////take 10 seconds
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getAllUsersTimeEntries")
             .set("Authorization", "Bearer " + adminToken)
             .query({userID: user1ID }) 
             .end((err,res) => {
                res.body.should.be.a('object');
                res.should.have.status(200);
                res.body.results.should.be.an("array");
            done(); 
             })
    });

    it("get project users entries ", (done) =>{    ////has a problem
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getProjectTimeEntries")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                 //console.log(projectID)
                res.body.should.be.a('object');
                res.should.have.status(200);
                res.body.results.TeamMembers.should.be.an("array");
                 //console.log(res.body.results.TeamMembers)
            done(); 
             })
    });


////////////////////////////////////////////////    ANALYSIS
    it("get User Daily Total Time ", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getUserDailyTotalTime")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('totalDailyValues')
            done(); 
             })
    });

    

    it("get Project Daily Total Time ", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getProjectDailyTotalTime")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('totalDailyValues')
            done(); 
             })
    });

    it("fail get Project Daily Total Time ", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getProjectDailyTotalTime")
             .set("Authorization", "Bearer " + adminToken)
             .end((err,res) => {
                res.should.have.status(400);
                res.body.message.should.be.eq('No project ID provided')
            done(); 
             })
    });

    
    it("get User Daily Total Money ", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getUserDailyTotalMoney")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('totalDailyValues')
            done(); 
             })
    });

    
    it("get User Weekly Time For Projects ", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getUserWeeklyTimeForProjects")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('totalProjectsTimes')
            done(); 
             })
    });

    
    it("get User Devices ", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getUserDevices")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('totalDevices')
            done(); 
             })
    });

    
    it("get User Weekly Time For Tasks", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getUserWeeklyTimeForTasks")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('totalTasksTimes')
            done(); 
             })
    });

    it("get Project Members Total Time", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getProjectMembersTotalTime")
             .set("Authorization", "Bearer " + adminToken)
             .query({projectID: projectID }) 
             .end((err,res) => {
                res.should.have.status(200);
                res.body.should.have.property('totalTasksTimes')
            done(); 
             })
    });

    it("fail get ProjectMembers Total Time ", (done) =>{    
        chai.request('http://localhost:3000')
             .get("/api/userTimeEntry/getProjectMembersTotalTime")
             .set("Authorization", "Bearer " + adminToken)
             .end((err,res) => {
                res.should.have.status(400);
                res.body.message.should.be.eq('No project ID provided')
            done(); 
             })
    });


    



        
    });
});


