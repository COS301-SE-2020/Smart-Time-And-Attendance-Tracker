function showTime() {
    var desc = document.getElementById("desc");
    desc.innerHTML="";
    for (tabId in chrome.extension.getBackgroundPage().History) {
        var hist = chrome.extension.getBackgroundPage().History[tabId];
        console.log(hist);
        var now = new Date();
        var url = chrome.extension.getBackgroundPage().History[tabId][0][1];
        url = url.split("://")[1];
        url = url.split("/")[0];
        desc.innerHTML += url + ": ";
        desc.innerHTML += FormatDuration(now - chrome.extension.getBackgroundPage().History[tabId][0][0]) + "\n";

    }
}

setInterval(showTime, 1000);
