login();
var token = "";
function login(url,startTime, endTime) {
    console.log("hello req");
    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/api/user/login';
    
    var data = {
        'Description': url
    };
    console.log("Saving data");
    console.log(data);
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("authorization", "token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmMDA3NDI5ZjFjYzlhNDViYzk4YjQ5YSIsImF1dGhlbnRpY2F0ZSI6dHJ1ZSwicm9sZXMiOls1LDNdLCJpYXQiOjE1OTM4NjY1MzYsImV4cCI6MTU5Mzk1MjkzNn0.Gzj8FIIcmyQHaEUXZBSQF7fVez1_41gz42DIY-xNQcs");
    console.log("OPENED  " + http.readyState);  // readyState will be 1
    http.onreadystatechange = function() {
        console.log("http.readyState " + http.readyState);
        console.log("http.status " + http.status);
        if(http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
            var data = JSON.parse(http.responseText);
            token = data.token;
        }
        else if(http.readyState == 4 && http.status == 500) {
            alert(http.responseText);
        }
        else if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }

    http.onprogress = function () {
        console.log('LOADING', http.readyState); // readyState will be 3
    };
    
    http.onload = function () {
        console.log('DONE', http.readyState); // readyState will be 4
    };
    var text = '{ "email":"tester1@gmail.com" , "password":"Abcd@1234" }';
    http.send(text);
} 


