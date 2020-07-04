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

var pauseTimer = document.getElementById("btn");
var startTimer = document.getElementById("btn1");
var resetTimer = document.getElementById("reset");
var saveTime = document.getElementById("save");
var History = {};


chrome.browserAction.setBadgeText({ 'text': '?'});
chrome.browserAction.setBadgeBackgroundColor({ 'color': "#777" });

setInterval(showTime, 1000);
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
    
    chrome.browserAction.setBadgeText({ 'tabId': tabId, 'text': '0:00'});
    chrome.browserAction.setPopup({ 'tabId': tabId, 'popup': "popup.html#tabId=" + tabId});
}

function HandleUpdate(tabId, changeInfo, tab) {
    Update(new Date(), tabId, changeInfo.url);
  }
  
  function HandleRemove(tabId, removeInfo) {
    save();
    alert("removed time  " + getCookie("historyTime"+url));
    delete History[tabId];
  }
  
  function HandleReplace(addedTabId, removedTabId) {
    var t = new Date();
    delete History[removedTabId];
    chrome.tabs.get(addedTabId, function(tab) {
      Update(t, addedTabId, tab.url);
    });
  }


  function UpdateBadges() {
      var now = new Date();
    for (tabId in History) {
      var description, url = History[tabId][0][1];
      if(History[tabId][0][0] != -1)
      {
        //alert("cc " + getCookie("historyTime"+url));
        description = addTimes([FormatDuration(now - History[tabId][0][0]), getCookie("historyTime"+url)]); 
      }
      else
        description = getCookie("historyTime"+url);
      chrome.browserAction.setBadgeText({ 'tabId': parseInt(tabId), 'text': description});
    }
}


function showTime() {
    var now = new Date();
    var url = chrome.extension.getBackgroundPage().History[match[1]][0][1];
    var desc = document.getElementById("desc");
    desc.innerHTML = url + ": ";
    if(chrome.extension.getBackgroundPage().History[match[1]][0][0] != -1)
    {
      var curr = chrome.extension.getBackgroundPage().History[match[1]][0][0];
      //alert(FormatDuration(now - curr));
  
      var cookieTime = getCookie("historyTime"+url);
      //alert("cookieTime "+ cookieTime);
      
      desc.innerHTML += addTimes([FormatDuration(now - curr), cookieTime]);
    }
    else
      desc.innerHTML += getCookie("historyTime"+url);
}

saveTime.onclick = save;
  
  function save() {
    var now  = new Date();
    var curr = chrome.extension.getBackgroundPage().History[match[1]][0][0];
    var url = chrome.extension.getBackgroundPage().History[match[1]][0][1];
    var cookieTime = getCookie("historyTime"+url);
  
    var saveTime =  addTimes([FormatDuration(now - curr), cookieTime]);
    var saveUrl = url;
  
    chrome.extension.getBackgroundPage().History[match[1]][0][0] = now;
    var url = chrome.extension.getBackgroundPage().History[match[1]][0][1];
    setCookie("historyTime"+url, "0:0:0", 1);
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