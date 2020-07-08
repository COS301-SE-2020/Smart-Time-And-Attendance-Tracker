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
        if(isString(chrome.extension.getBackgroundPage().History[currentID][0][0]) == false)
        { 
            desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
        }
        else
            desc.innerHTML += chrome.extension.getBackgroundPage().History[currentID][0][0]+ "\n";
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
        console.log("Stoped timer. Saving data  " + chrome.extension.getBackgroundPage().History[currentID][0][0]);
        AddTimeEntry(url, chrome.extension.getBackgroundPage().History[currentID][0][0], now);
        chrome.extension.getBackgroundPage().History[currentID][0][0] = FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]);
        startTimer.style.display = "block";
        stopTimer.style.display = "none";
    });   
}

startTimer.onclick = function(){
    var now  = new Date();
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        currentID = tabs[0].id;
        var url = chrome.extension.getBackgroundPage().History[currentID][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        desc.innerHTML = url + ": ";
        desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]) + "\n";
        console.log("Started tracking again  " + url);
        chrome.extension.getBackgroundPage().History[currentID][0][0] = now;
        stopTimer.style.display = "block";
        startTimer.style.display = "none";
    });   
}

setInterval(showTime, 1000);    //calling function every second

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
displayButton();