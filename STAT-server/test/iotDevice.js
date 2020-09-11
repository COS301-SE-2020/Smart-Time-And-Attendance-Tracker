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

var IOTDeviceID;
var timeEntryID;

describe("USER endpoints", ()=>{   
    
    
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



            it("fail devise register - No device name", (done) =>{
                let user = {
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/register")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(400);
                        res.body.message.should.be.eq('No device name provided');
                    done(); 
                     })
            });

            
            it("fail devise register - No device macAddress", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/register")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(400);
                        res.body.message.should.be.eq("No device's Mac address ID provided");
                    done(); 
                     })
            });

            it("pass devise register ", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                    macAddress:"mocha macs"+date

                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/register")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(200);
                        res.body.message.should.be.eq("IOT Device successfully registered.");
                        IOTDeviceID=res.body.IOTDeviceID;
                       // console.log(IOTDeviceID)
                    done(); 
                     })
            });

            it("pass re-register devise ", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                    macAddress:"mocha macs"+date

                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/register")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(200);
                        res.body.message.should.be.eq("Re-registered IOT Device");
                    done(); 
                     })
            });


            //////////getAllDevices
            it("get All Devices", (done) =>{
                let user = {

                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/getAllDevices")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(200);
                        res.body.should.have.property("iotDevices");
                    done(); 
                     })
            });

            it("fail start tracking without IOTDeviceID - no user id", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                    macAddress:"mocha macs"+date
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/startTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(500);
                    done(); 
                     })
            });

            it("fail start tracking with IOTDeviceID  - no user id", (done) =>{
                let user = {
                    deviceID:IOTDeviceID
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/startTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        // console.log(res.body)
                        res.should.have.status(500);
                    done(); 
                     })
            })
/////apa
            it("pass start tracking without IOTDeviceID", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                    macAddress:"mocha macs"+date,
                    userID:user1ID
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/startTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(200);
                        timeEntryID=res.body.timeEntryID
                    done(); 
                     })
            });

            
            it("pass start tracking with IOTDeviceID", (done) =>{
                let user = {
                    deviceID:IOTDeviceID,
                    userID:user1ID
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/startTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        /// console.log(res.body)
                        res.should.have.status(200);
                    done(); 
                     })
            });


            it("fail start tracking without IOTDeviceID - wrong device name", (done) =>{
                let user = {
                    deviceName:"mocha",
                    macAddress:"mocha macs"+date
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/startTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(404);
                        res.body.message.should.be.eq("IOT Device not found");
                        
                    done(); 
                     })
            });

           it("fail start tracking with IOTDeviceID  - wrong device id", (done) =>{
                let user = {
                    deviceID:IOTDeviceID+"1"
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/startTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(500);
                        
                    done(); 
                     })
            });

            it("fail start tracking - no device name provided", (done) =>{
                let user = {
                    deviceName:"mocha"
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/startTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(400);
                        res.body.message.should.be.eq("No project ID provided or device MAC Address provided");
                        
                    done(); 
                     })
            });

///////////////////////stop
           it("fail stop tracking without IOTDeviceID", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                    macAddress:"mocha macs"+date,
                    timeEntryID:timeEntryID
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/stopTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(500);
                    done(); 
                     })
            });

            it("fail stop tracking with IOTDeviceID", (done) =>{
                let user = {
                    deviceID:IOTDeviceID,
                    timeEntryID:timeEntryID
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/stopTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        // console.log(res.body)
                        res.should.have.status(500);
                    done(); 
                     })
            })

            it("pass start tracking without IOTDeviceID", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                    macAddress:"mocha macs"+date,
                    userID:user1ID,
                    timeEntryID:timeEntryID
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/stopTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                         console.log(res.body)
                        res.should.have.status(200);
                    done(); 
                     })
            });

            
            it("pass start tracking with IOTDeviceID", (done) =>{
                let user = {
                    deviceID:IOTDeviceID,
                    userID:user1ID,
                    timeEntryID:timeEntryID
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/stopTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        /// console.log(res.body)
                        res.should.have.status(200);
                    done(); 
                     })
            });

        //passes
            it("fail stop tracking without IOTDeviceID", (done) =>{
                let user = {
                    deviceName:"mocha",
                    macAddress:"mocha macs"+date
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/stopTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(404);
                        res.body.message.should.be.eq("IOT Device not found");
                        
                    done(); 
                     })
            });

            it("fail stop tracking with IOTDeviceID", (done) =>{
                let user = {
                    deviceID:IOTDeviceID+"1"
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/stopTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(500);
                        
                    done(); 
                     })
            });

            it("fail stop tracking - no device name provided", (done) =>{
                let user = {
                    deviceName:"mocha"
                }
                chai.request('http://localhost:3000')
                     .post("/api/iotDevice/stopTimer")
                     .set("Authorization", "Bearer " + adminToken)
                     .send(user)
                     .end((err,res) => {
                        res.should.have.status(400);
                        res.body.message.should.be.eq("No project ID provided or device MAC Address provided");
                        
                    done(); 
                     })
            });

////deregiter -----------------------------------------------------
           

            it("pass reregister IOT Device by and mac", (done) =>{
                let user = {
                    deviceName:"mocha"+date,
                    macAddress:"mocha macs"+date,
                    userID:user1ID,
                    timeEntryID:timeEntryID
                }
                chai.request('http://localhost:3000')
                    .post("/api/iotDevice/deregister")
                    .set("Authorization", "Bearer " + adminToken)
                    .send(user)
                    .end((err,res) => {
                        console.log(res.body)
                        res.should.have.status(200);
                    done(); 
                    })
            });


            it("Device already deregistered- iot id", (done) =>{
                let user = {
                    deviceID:IOTDeviceID,
                    userID:user1ID,
                    timeEntryID:timeEntryID
                }
                chai.request('http://localhost:3000')
                    .post("/api/iotDevice/deregister")
                    .set("Authorization", "Bearer " + adminToken)
                    .send(user)
                    .end((err,res) => {
                        /// console.log(res.body)
                        res.should.have.status(200);
                    done(); 
                    })
            });

            //passes
            it("fail deregister by name and mac - wrong name", (done) =>{
                let user = {
                    deviceName:"mocha",
                    macAddress:"mocha macs"+date
                }
                chai.request('http://localhost:3000')
                    .post("/api/iotDevice/deregister")
                    .set("Authorization", "Bearer " + adminToken)
                    .send(user)
                    .end((err,res) => {
                        res.should.have.status(404);
                        res.body.message.should.be.eq("Project not found");
                        
                    done(); 
                    })
            });

            it("fail deregister by id - wrong id", (done) =>{
                let user = {
                    deviceID:IOTDeviceID+"1"
                }
                chai.request('http://localhost:3000')
                    .post("/api/iotDevice/deregister")
                    .set("Authorization", "Bearer " + adminToken)
                    .send(user)
                    .end((err,res) => {
                        res.should.have.status(500);
                        
                    done(); 
                    })
            });

            it("fail deregister - no device name provided", (done) =>{
                let user = {
                    deviceName:"mocha"
                }
                chai.request('http://localhost:3000')
                    .post("/api/iotDevice/deregister")
                    .set("Authorization", "Bearer " + adminToken)
                    .send(user)
                    .end((err,res) => {
                        res.should.have.status(400);
                        res.body.message.should.be.eq("No project ID provided or device MAC Address provided");
                        
                    done(); 
                    })
            });

                        




           ///start tracking
           ///stop tracking



 });

