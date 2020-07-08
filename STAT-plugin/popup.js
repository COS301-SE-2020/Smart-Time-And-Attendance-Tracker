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
        console.log("Stopeed tracking " + url);
        var success = AddTimeEntry(url, chrome.extension.getBackgroundPage().History[currentID][0][0], now);
        if(success) {
            chrome.extension.getBackgroundPage().History[currentID][0][0] = FormatDuration(now - chrome.extension.getBackgroundPage().History[currentID][0][0]);
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