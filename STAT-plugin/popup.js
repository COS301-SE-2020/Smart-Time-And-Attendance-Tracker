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

var stopTimer = document.getElementById("stop");
var startTimer = document.getElementById("start");
setInterval(showTime, 1000);

SelectTask.onclick = function() {
    var task = "abc";
    document.getElementById("select_task_form").style.display="none";
    document.getElementById("selected_task").style.display="block";
    document.getElementById("task").innerHTML = ("Task : " + task);
}

stopTimer.onclick = function(){
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
            startTimer.style.display = "block";
            stopTimer.style.display = "none";
        }
        else {
            //error occured
        }
        
    });   
}

startTimer.onclick = function(){
    var now  = new Date();
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        console.log("Started tracking " + url);
        chrome.extension.getBackgroundPage().History[currentID][0][0] = now;
        stopTimer.style.display = "block";
        startTimer.style.display = "none";
    });   
}

//setInterval(showTime, 1000);    //calling function every second

function displayButton() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        if(isString(chrome.extension.getBackgroundPage().History[currentID][0][0]) == false)
        { 
            stopTimer.style.display = "block";
            startTimer.style.display = "none";
        }
        else
        {
            startTimer.style.display = "block";
            stopTimer.style.display = "none";
        }
    }); 
}
//displayButton();