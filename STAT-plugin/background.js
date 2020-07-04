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

var tabId_re = /tabId=([0-9]+)/;
var match = tabId_re.exec(window.location.hash);

var History = {};
chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

//setInterval(showTime, 1000);
setInterval(UpdateBadges, 1000);

chrome.tabs.onUpdated.addListener(HandleUpdate);
chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);

function Update(t, tabId, url) {
    if (!url) {
        return;
    }
    if (tabId in History) {
        if (url == History[tabId][0][1]) {
            return;
        }
    }
    else {
        History[tabId] = [];
    }
    History[tabId].unshift([t, url]);
    
    var history_limit = parseInt(localStorage["history_size"]);
    if (! history_limit) {
        history_limit = 23;
    }
    while (History[tabId].length > history_limit) {
        History[tabId].pop();
    }
    setCookie("historyTime"+url, now);
    chrome.browserAction.setBadgeText({ 'tabId': tabId, 'text': '0:00'});
    chrome.browserAction.setPopup({ 'tabId': tabId, 'popup': "popup.html#tabId=" + tabId});
}

function HandleUpdate(tabId, changeInfo, tab) {
    console.log(changeInfo);
    console.log(tab);
    console.log("update " + tabId );
    Update(new Date(), tabId, changeInfo.url);
  }
  
  function HandleRemove(tabId, removeInfo) {    //working
    save();
    delete chrome.extension.getBackgroundPage().History[tabId];
  }
  
  function HandleReplace(addedTabId, removedTabId) {
      console.log("replace");
    var t = new Date();
    delete chrome.extension.getBackgroundPage().History[removedTabId];
    chrome.tabs.get(addedTabId, function(tab) {
      Update(t, addedTabId, tab.url);
    });
  }


  function UpdateBadges() {
    var now = new Date();
    for (tabId in History) {
        var description = FormatDuration(now - History[tabId][0][0]);
        chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabId), 'text': description});
    }
    
}

function save() {
    var now  = new Date();
    var url = chrome.extension.getBackgroundPage().History[match[1]][0][1];
    //var cookieTime = getCookie("historyTime"+url);
    var cookieTime = chrome.extension.getBackgroundPage().History[match[1]][0][0];
    var saveTime = FormatDuration(cookieTime - now);
    //var saveTime =  addTimes([FormatDuration(now - curr), cookieTime]);
    console.log("send api   =>   " + "url:" + url + "+time: " + saveTime)
    chrome.extension.getBackgroundPage().History[match[1]][0][0] = now;
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