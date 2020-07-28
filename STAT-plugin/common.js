var token = "";
var name = "";
var surname = "";
var status=false; 
var userLogin = document.getElementById("login");

var userName="";
    ///////check if name and token exist - if not keep showing form -if they do, hide form and move on
    if (document.cookie.indexOf('name') > -1 && document.cookie.indexOf('token') > -1) {
      //cookie exists - hide form
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("popup").style.display = "block";
      document.getElementById("userName").innerHTML=getCookie("name");
      document.getElementById("userEmail").innerHTML=getCookie("email");
      document.getElementById("errorMessage").innerHTML= "";
      //document.getElementById("start").style.display  ="block";
      //document.getElementById("stop").style.display = "block";
      //document.getElementById("stop").style.visibility = "visible";

      ///call tracking function to start
      ////show starts and stop
      displayButton();
  }
  else{  ///hide everything except the login form
      document.getElementById("errorMessage").innerHTML= "Login to start tracking";
      //document.getElementById("start").style.display = "none";
      //document.getElementById("stop").style.display  ="none";
      document.getElementById("popup").style.display = "none";
  }
userLogin.onclick = function(){
        console.log("sdvdsdfsdf");
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/api/user/login';
        http.open('POST', url, true);
        http.setRequestHeader('Content-type', 'application/json');
        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                ////set name and token into cookies
                console.log(data);
                setCookie("token", data.token, 1);
                setCookie("name", data.name, 1);
                setCookie("email", data.email, 1);
                console.log(data);
                getTasks();
                setCookie("stop", "false", 1); 
                document.getElementById("userName").innerHTML=data.name;
                document.getElementById("userEmail").innerHTML=data.email;
                document.getElementById("loginForm").style.display = "none";
                document.getElementById("popup").style.display = "block";
                document.getElementById("errorMessage").innerHTML= "";
                /////look for name 
                getUserName();
                ///show start and stop buttons
                 setInterval(showTime, 1000);
                ////start tracking
                ////show starts and stop
                 displayButton();
                 for(tabID in chrome.extension.getBackgroundPage().History) {
                   //alert("tab ID " + tabID);
                  chrome.extension.getBackgroundPage().History[tabID][0][0] = new Date();
                  AddTimeEntry(chrome.extension.getBackgroundPage().History[tabID][0][0], chrome.extension.getBackgroundPage().History[tabID][0][1], new Date(), tabID);

                 }
            }
            else {
                   var data = JSON.parse(http.responseText);
                   document.getElementById("errorMessage").innerHTML=data.message;
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
//getUserName();
/////get name and email
function getUserName(){
        var http = new XMLHttpRequest();
        var url = 'http://localhost:3000/api/user/getName';
        http.open('GET', url, true);
        http.setRequestHeader('Authorization', `Bearer ${getCookie("token")}` );
        http.onreadystatechange = function()
        {
            if(http.readyState == 4 && http.status == 200) {
                var data = JSON.parse(http.responseText);
                console.log(data);
                //setCookie("token", data.token, 1);
                setCookie("name", data.name, 1);
                setCookie("email", data.surname, 1);
                console.log(data);
                //alert(http.responseText);
                console.log("token");
                document.getElementById("userName").innerHTML=data.name;
                document.getElementById("userEmail").innerHTML=data.surname;
            }
            else {
                   var data = JSON.parse(http.responseText);
                   document.getElementById("errorMessage").style.display="block";
                   document.getElementById("errorMessage").innerHTML=data.message;
                   
                   console.log(data);
            }
        }
        http.send();
}


//getTasks();
function getTasks() {
  tasksDropdown = document.getElementById("tasks");
  if(tasksDropdown.childElementCount == 0)
  {
    var http = new XMLHttpRequest();
    var apiURL = 'http://localhost:3000/api/user/getTasks';

    var text = '{ "token": "'+ getCookie("token") + '"' + '}';
    http.open('POST', apiURL, true);

    http.setRequestHeader('Content-type', 'application/json');
    http.setRequestHeader("authorization", "token "+getCookie("token"));
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            const obj = JSON.parse(http.responseText);
            for( t in obj.tasks)
            {
              var opt = document.createElement('option');
              opt.appendChild( document.createTextNode(obj.tasks[t].taskName) );
              opt.value = obj.tasks[t].ID;
              opt.name = obj.tasks[t].projectName;
              tasksDropdown.appendChild(opt); 
            }
        }
        else if(http.readyState == 4 && http.status != 200) {  //error in recording time
            console.log(http.responseText);
        }
    }
    http.send(text);
  }
}

function convertDurationToInt(time) {
  var seconds = new Date('1970-01-01T' + time + 'Z').getTime() / 1000;
  return seconds;
}

function getTimeWithID(currentID){
  var now = new Date();
  var t ="";
  if(isString(chrome.extension.getBackgroundPage().History[currentID][0][0]) == false)
  { 
    //.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
    t = FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]);
    t = addTimes([t, document.cookie.indexOf("historyTime"+currentID)]);
  }
  else
  {
    //alert(chrome.extension.getBackgroundPage().History[currentID][0][0])
    //alert("dis 2.2");
    t = FormatDuration(chrome.extension.getBackgroundPage().History[currentID][0][0]);
  }
  //t = t.slice(0, -3);
  //t+= ":00";
  //alert("time  : " + t);
  if(t.includes("NaN"))
    t = "00:00:00";
  return t;
}

function AddTimeEntry(url,startTime, endTime,currentID ) {
  //getTasks();
  //alert(getTimeWithID(currentID));
  //alert("url: " + url);
      var http = new XMLHttpRequest();
      var apiURL = 'http://localhost:3000/api/userTimeEntry/addTimeEntry';
      var text = '{ "Description": "'+ url + '",'
          + '"StartTime": "'+ startTime.getTime() + '",' 
          + '"EndTime": "'+ endTime.getTime() + '",' 
          + '"Device": "Browser",' 
          + '"ProjectName": "Un-specified",' 
          + '"TaskName": "Un-specified",' 
          + '"ActiveTime":'+ convertDurationToInt(getTimeWithID(currentID)) +',' 
//          + '"ActiveTime":' + convertDurationToInt(getTimeWithID(currentID)) + ',' 
          + '"Date": "'+ new Date() + '"' 
          + '}';

      http.open('POST', apiURL, true);

      http.setRequestHeader('Content-type', 'application/json');
      http.setRequestHeader("authorization", "token "+ getCookie("token"));
      //alert(getCookie("token"));
      http.onreadystatechange = function() {
        //alert(http.readyState + "  " + http.status);
          if(http.readyState == 4 && http.status == 200) {
              const obj = JSON.parse(http.responseText);
              chrome.extension.getBackgroundPage().History[currentID][0][2] = obj.timeEntryID;
              chrome.extension.getBackgroundPage().History[currentID][0][0] = new Date();
              setCookie("historyTime"+currentID, "00:00", 1);
              console.log("id :   " + obj.timeEntryID);
              status = true;
              return status;
          }
          else if(http.readyState == 4 && http.status != 200) {  //error in recording time
              chrome.extension.getBackgroundPage().History[currentID][0][2] = "";
              chrome.extension.getBackgroundPage().History[currentID][0][0] = new Date();
              //alert(http.responseText);
              status = false;
              return status;
          }
      }
      http.send(text);
}
function UpdateTimeEntry(endTime,currentID ) {
  //getTasks();
  //alert(convertDurationToInt(getTimeWithID(currentID)));
  //alert("endTime: " + endTime);
      var http = new XMLHttpRequest();
      var apiURL = 'http://localhost:3000/api/userTimeEntry/updateTimeEntry';
      var text = '{'
          + '"TimeEntryID": "'+ chrome.extension.getBackgroundPage().History[currentID][0][2] + '",'  
          + '"EndTime": "'+ endTime.getTime() + '",'  
          + '"ActiveTime":'+ convertDurationToInt(getTimeWithID(currentID)) +',' 
          + '}';

      http.open('POST', apiURL, true);

      http.setRequestHeader('Content-type', 'application/json');
      http.setRequestHeader("authorization", "token "+ getCookie("token"));
      //alert(getCookie("token"));
      http.onreadystatechange = function() {
        //alert(http.readyState + "  " + http.status);
          if(http.readyState == 4 && http.status == 200) {
              const obj = JSON.parse(http.responseText);
              //alert("message :   " + obj.message);
              status = true;
              return status;
          }
          else if(http.readyState == 4 && http.status != 200) {  //error in recording time
              chrome.extension.getBackgroundPage().History[currentID][0][2] = "";
              chrome.extension.getBackgroundPage().History[currentID][0][0] = new Date();
              //alert(http.responseText);
              status = false;
              return status;
          }
      }
      http.send(text);
}

function UpdateTask(currentID, tasksDropdown) {
  var taskID =  tasksDropdown.options[ tasksDropdown.selectedIndex ].value;
  var TimeEntryID = chrome.extension.getBackgroundPage().History[currentID][0][2];
  var http = new XMLHttpRequest();
  var apiURL = 'http://localhost:3000/api/userTimeEntry/updateTimeEntry';
  var text = '{ "TimeEntryID": "'+ TimeEntryID + '",'
      + '"TaskID": "'+ taskID + '",' 
      + '"Request": "update task"' 
      + '}';

  http.open('POST', apiURL, true);
  http.setRequestHeader('Content-type', 'application/json');
  http.setRequestHeader("authorization", "token "+getCookie("token"));
  
  http.onreadystatechange = function() {
      if(http.readyState == 4 && http.status == 200) {
        var task =  tasksDropdown.options[ tasksDropdown.selectedIndex ].innerHTML;
        var project =  tasksDropdown.options[ tasksDropdown.selectedIndex ].name;
        document.getElementById("select_task_form").style.display="none";
        document.getElementById("selected_task").style.display="block";
        document.getElementById("task").innerHTML = ("Project : " + project + "\nTask : " + task);
      }
      else if(http.readyState == 4 && http.status != 200) {  //error in recording time
          console.log(http.responseText);
          document.getElementById("task_error").innerHTML = http.responseText.message;
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


