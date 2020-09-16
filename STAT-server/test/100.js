let chai =require('chai')
let chaiHttp =require('chai-http');



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

    for (let index = 0; index <100; index++) {
        it("register a user", (done) =>{
            let user = {
                name:Name,
                surname:Surname,
                email: date,
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
                    console.log("creating user "+ index)
                done(); 
                 })
        });  
    }
            





 });

