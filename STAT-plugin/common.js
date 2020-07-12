///////check if name and token exist - if not keep showing form -if they do, hide form and move on
if (document.cookie.indexOf('name') > -1 && document.cookie.indexOf('token') > -1) {
       //cookie exists - hide form
       document.getElementById("loginForm").style.display = "none";
       document.getElementById("userName").innerHTML=getCookie("name");
       document.getElementById("userEmail").innerHTML=getCookie("email");
       document.getElementById("otherMessages").innerHTML= "";
       ///call tracking function to start
        displayButton();
       setInterval(showTime, 1000);
       ////show starts and stop
      
}
else{  ///hide everything except the login form
       
      document.getElementById("otherMessages").innerHTML= "Login to start tracking";


       document.getElementById("start").style.display = "none";
       document.getElementById("stop").style.display  ="none";
}



var token = "";
var name = "";
var surname = "";
var status=false; 
var userLogin = document.getElementById("login");

var userName="";

userLogin.onclick = function(){
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/api/user/login';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                ////set name and token into cookies
                setCookie("token", data.token, 1);
                setCookie("name", data.name, 1);
                setCookie("email", data.email, 1);

                console.log(data);

                document.getElementById("userName").innerHTML=data.name;
                 document.getElementById("userEmail").innerHTML=data.email;
                document.getElementById("loginForm").style.display = "none";
                document.getElementById("otherMessages").innerHTML= "";
                ///show start and stop buttons
                 displayButton();
                 setInterval(showTime, 1000);
                ////start tracking
                ////show starts and stop
                 
            }
            else {
                   var data = JSON.parse(http.responseText);
                   document.getElementById("userName").innerHTML=data.message;
                   console.log(data);
            }
        }
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        console.log(password);
        console.log(email);
        var userData = '{ "email": "'+ email + '",' + '"password": "'+ password + '"' +'}';
        console.log(userData);
      // var userData = JSON.stringify({ "email":email, "password":password});
        http.send(userData);
}


/*
function login() {
    if(token == ""){
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/api/user/login';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function() {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                token = data.token;
                // get user name and surname using token and store in maybe a cookie
                return true;
            }
            else {
                console.log(http.responseText);     //error => should not track time if user not logined
                return false;
            }
        }
        var text = '{ "email":"tester1@gmail.com" , "password":"Abcd@1234" }';
        http.send(text);
    }
} 
*/

function AddTimeEntry(url,startTime, endTime,currentID ) {
    var http = new XMLHttpRequest();
    var apiURL = 'http://localhost:3000/api/userTimeEntry/addTimeEntry';
    var text = '{ "Description": "'+ url + '",'
        + '"StartTime": "'+ startTime.getTime() + '",' 
        + '"EndTime": "'+ endTime.getTime() + '",' 
        + '"TaskID": "abcd1234",' 
        + '"Device": "Google Chrome Browser",' 
        + '"Date": "'+ new Date() + '"' 
        + '}';

    http.open('POST', apiURL, true);
    if(token == "")
        login();
    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("authorization", "token "+token);
    http.onreadystatechange = function() {
        console.log(http.readyState + " " + http.status);
        if(http.readyState == 4 && http.status == 200) {
            const obj = JSON.parse(http.responseText);
            chrome.extension.getBackgroundPage().History[currentID][0][2] = obj.TimeEntryID;
            chrome.extension.getBackgroundPage().History[currentID][0][0] = startTime;
            status = true;
            return status;
        }
        else if(http.readyState == 4 && http.status != 200) {  //error in recording time
            console.log(http.responseText);
            status = false;
            return status;
        }
    }
    http.send(text);
    
}

function getStatus() {
    var temp = status;
    stauts = false;
    return temp;
}
function isString(str) {
    return typeof str == "string";
}

function getCookie(cname) {
    //alert(cname.includes("historyTime"));
    if(document.cookie.includes(cname) == false && cname.includes("historyTime"))
      return "0:0:0";
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  function FormatDuration(d) {
    if (d < 0) {
      return "?";
    }
    var divisor = d < 3600000 ? [60000, 1000] : [3600000, 60000];
    function pad(x) {
      return x < 10 ? "0" + x : x;
    }
    return Math.floor(d / divisor[0]) + ":" + pad(Math.floor((d % divisor[0]) / divisor[1]));
  }
  
function char_count(str, letter) 
{
 var letter_Count = 0;
 for (var position = 0; position < str.length; position++) 
 {
    if (str.charAt(position) == letter) 
      {
      letter_Count += 1;
      }
  }
  return letter_Count;
}

function addTimes(times = []) {

    const z = (n) => (n < 10 ? '0' : '') + n;
    for(var i=0; i<times.length; i++) {
  
      if(char_count(times[i],":") == 0)
      {
        times[i] = "0:0:"+times[i];
      }
      else if(char_count(times[i],":") == 1)
      {
        times[i] = "0:"+times[i];
      }
      else if(char_count(times[i],":") == 2)
      {}
      //alert("time " + (i+1) + " : " + times[i]);
    }
    let hour = 0
    let minute = 0
    let second = 0
    for (const time of times) {
        const splited = time.split(':');
        hour += parseInt(splited[0]);
        minute += parseInt(splited[1])
        second += parseInt(splited[2])
    }
    const seconds = second % 60
    const minutes = parseInt(minute % 60) + parseInt(second / 60)
    const hours = hour + parseInt(minute / 60)
  
    return z(hours) + ':' + z(minutes) + ':' + z(seconds)
  }


