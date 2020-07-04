function showTime() {
    var currentID =0;
    var now = new Date();
    var desc = document.getElementById("desc");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        if(chrome.extension.getBackgroundPage().History[currentID][0][0] != -1)
        {
            var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
            url = url.split("://")[1];
            url = url.split("/")[0];
            desc.innerHTML = url + ": ";
            desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
        }
    });    
}

var stopTimer = document.getElementById("stop");
var startTimer = document.getElementById("start");

stopTimer.onclick = function(){
    var now  = new Date();
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        desc.innerHTML = url + ": ";
        desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
        console.log("Stoped timer. Saving data");
        SaveTime(url, now, chrome.extension.getBackgroundPage().History[currentID][0][0]);
        chrome.extension.getBackgroundPage().History[currentID][0][0] = -1;
        startTimer.style.display = "block";
        stopTimer.style.display = "none";
        
    });   
}
var socket = io();
socket.on('connect', function () { 
			
})

function SaveTime(url,startTime, endTime) {
    var http = new XMLHttpRequest();
    var url = '/api/userTimeEntry/';
   
    var data = new FormData();
    data.append('Description', url);
    data.append('StartTime', startTime);
    data.append('EndTime', endTime);
    data.append('TaskID', "abcd1234");
    data.append('Device', "Browser");
    data.append('Date', new Date());
    console.log("Saving data");
    console.log(data);
    http.open('POST', url, true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    http.send(data);
}

function Save() {

}



setInterval(showTime, 1000);
