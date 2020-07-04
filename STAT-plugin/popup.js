function showTime() {
    var currentID =0;
    var now = new Date();
    var desc = document.getElementById("desc");
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        desc.innerHTML = url + ": ";
        desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
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
        chrome.extension.getBackgroundPage().History[currentID][0][0] = -1;
        startTimer.style.display = "block";
        stopTimer.style.display = "none";
    });   
}



setInterval(showTime, 1000);
