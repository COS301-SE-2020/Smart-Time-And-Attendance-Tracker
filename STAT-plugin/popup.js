function showTime() {
    var currentID =0; //
    var now = new Date();
    var desc = document.getElementById("desc");
    var name = document.getElementById("name");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        name = "Mock user";// get user's name and surname from the cookie (if we using a cookie) and display that
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        //desc.innerHTML = url + ": ";
        var description="";
        if(isString(chrome.extension.getBackgroundPage().History[currentID][0][0]) == false)
        { 
            //.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
            description = FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]);
            desc.innerHTML = addTimes([description, getCookie("historyTime"+currentID)]);

        }
        else
        {
            desc.innerHTML = chrome.extension.getBackgroundPage().History[currentID][0][0]+ "\n";
            description = FormatDuration(chrome.extension.getBackgroundPage().History[currentID][0][0]);
        }
    });    
}
var SelectTask = document.getElementById("select_task");
tasksDropdown = document.getElementById("tasks");

var stopStartBtn = document.getElementById("start_stop");
var pauseResumeBtn = document.getElementById("pause_resume");

//var startTimer = document.getElementById("start");
setInterval(showTime, 1000);

SelectTask.onclick = function() {
    if(tasksDropdown.selectedIndex == -1)
    {
        document.getElementById("task_error").innerHTML = "Invalid Task Selected.";
    }
    else{
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            currentID = tabs[0].id;
            UpdateTask(currentID, tasksDropdown);
        })
    }
    
}
    
function displayOptions(data) {
    const obj = JSON.parse(data);
    for( p in obj.projects)
              {
                for( t in obj.projects[p].tasks)
                {
                  if(obj.projects[p].tasks[t].taskStatus != "COMPLETED")
                  {
                    var opt = document.createElement('option');
                    opt.appendChild( document.createTextNode( obj.projects[p].tasks[t].taskName) );
                    opt.value = obj.projects[p].tasks[t].ID;
                    opt.name = obj.projects[p].projectName;
                    tasksDropdown.appendChild(opt); 
                  }
                }
              }
}
stopStartBtn.onclick = function(){
    //alert(stopStartBtn.name + "  " + stopStartBtn.value + "  " + stopStartBtn.innerHTML);
    //if(stopStartBtn.name == "stop")
    if(getCookie("stop") == "false")
    {
        var now  = new Date();
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            currentID = tabs[0].id;
            var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
            url = url.split("://")[1];
            url = url.split("/")[0];
            console.log("Stopeed tracking " + url);
            //AddTimeEntry(url, chrome.extension.getBackgroundPage().History[currentID][0][0], now);
            var success = true;//getStatus();
            console.log("success " + success);
            if(success) {
                var description = FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]);
                chrome.extension.getBackgroundPage().History[currentID][0][0] = addTimes([description, getCookie("historyTime"+currentID)]);
                //startTimer.style.display = "block";
                //stopTimer.style.display = "none";
                setCookie("stop", "true", 1); 
                stopStartBtn.name = "start";
                stopStartBtn.innerHTML = "Start";
                chrome.extension.getBackgroundPage().History[currentID][0][2] = "";
            }
            else {
                //error occured
            }
            
        });   
    }
    else{
        var now  = new Date();
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            currentID = tabs[0].id;
            var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
            AddTimeEntry(url, now, now, currentID);
            url = url.split("://")[1];
            url = url.split("/")[0];
            console.log("Started tracking " + url);
            chrome.extension.getBackgroundPage().History[currentID][0][0] = now;
            //stopTimer.style.display = "block";
            //startTimer.style.display = "none";
            setCookie("stop", "false", 1); 
            stopStartBtn.name = "stop";
            stopStartBtn.innerHTML = "Stop";
        });   
    }
}

/*
startTimer.onclick = function(){
    var now  = new Date();
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        AddTimeEntry(url, now, now, currentID);
        url = url.split("://")[1];
        url = url.split("/")[0];
        console.log("Started tracking " + url);
        chrome.extension.getBackgroundPage().History[currentID][0][0] = now;
        stopTimer.style.display = "block";
        startTimer.style.display = "none";
    });   
}
*/
//setInterval(showTime, 1000);    //calling function every second

function displayButton() {
    //alert(getCookie("tasks"));
       
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
    //alert(stopStartBtn.name + "  " + stopStartBtn.value + "  " + stopStartBtn.innerHTML);
    alert(document.cookie.indexOf("token"));
        if(document.cookie.indexOf("token") > -1)
        {
            if(getCookie("stop") == "false")
            { 
                stopStartBtn.name = "stop";
                stopStartBtn.innerHTML = "Stop";
                //stopTimer.style.display = "block";
                //startTimer.style.display = "none";
            }
            else
            {
                stopStartBtn.name = "start";
                stopStartBtn.innerHTML = "Start";
                //startTimer.style.display = "block";
                //stopTimer.style.display = "none";
            }
            if((getCookie("tasks")!=-1 || getCookie("tasks") != ""))
                displayOptions(getCookie("tasks"));
            else
            {
                if(getCookie("tasks").includes("\n"))
                    document.getElementById("task").innerHTML = getCookie("tasks");
                else
                    getTasks();
            }
        }
        else
        {
            alert(document.getElementById("popupPage").style.display);
            document.getElementById("popupPage").style.display = "block";
        }
    }); 
}
displayButton();


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