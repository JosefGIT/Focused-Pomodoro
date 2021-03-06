document.write('<script src="../chrome-services/storage.service.js"></script>');

var _blockedSites;
var _deleteActivated = false;
function getBlockedSites() {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ "requestMessage": "getBlockedSites" }, response => {
            resolve(response.blockedSites);
        });
    });
}

function getAlarmInfo(){
    return new Promise(resolve =>{
        chrome.runtime.sendMessage({"requestMessage":"getAlarmInfo"}, response =>{
            resolve(response.alarmInfo);
        });
    });
}

// Loads alarm-info into textfields
function loadAlarmInfo(){
    getAlarmInfo().then(alarmInfo => {
        document.getElementById("session-time").value = alarmInfo.sessionTimeInMinutes;
        document.getElementById("session-break-time").value = alarmInfo.shortBreakTimeInMinutes;
        document.getElementById("long-break-time").value = alarmInfo.longBreakTimeInMinutes
        document.getElementById("sessions-before-long-break").value = alarmInfo.sessionsBeforeLongBreak
        document.getElementById("time-before-reset").value = alarmInfo.timeBeforeResetInMinutes;
    });
}

// Creates list of users blocked sites
function loadBlockedSites() {
    getBlockedSites().then(sites => {
        _blockedSites = sites;
        var sitetable = document.getElementById("table.blockedSites");
        while(sitetable.rows.length > 1)
            sitetable.deleteRow(sitetable.rows.length-1);
        var i = 0;
        sites.forEach(site => {
            var row = sitetable.insertRow(sitetable.rows.length);
            var URLcell = row.insertCell(0);
            URLcell.innerHTML = site;
            var deletecell = row.insertCell(1);
            deletecell.innerHTML = "<button id='" + i + "'>X</button>";
            var siteId = i;
            document.getElementById(i).addEventListener('click', () => deleteURL(siteId));
            i++;
        });
        _deleteActivated = true;
    });
}

function deleteURL(rowNumber) {
    if (!_deleteActivated)
        return;
    _deleteActivated = false;
    _blockedSites.splice(rowNumber, 1);
    console.log(_blockedSites);
    chrome.runtime.sendMessage({
        "requestMessage": "updateBlockedSitesReturnNew",
        "newBlockedSites": _blockedSites
    }, response => {
        loadBlockedSites();
    });
}


document.getElementById("ok-button").addEventListener("click", () => {
    var sessionTime = parseInt(document.getElementById("session-time").value);
    var sessionBreakTime = parseInt(document.getElementById("session-break-time").value);
    var longBreakTime = parseInt(document.getElementById("long-break-time").value);
    var sessionsBeforeLongBreak = parseInt(document.getElementById("sessions-before-long-break").value);
    var timeBeforeReset = parseInt(document.getElementById("time-before-reset").value);
    chrome.runtime.sendMessage({
        "requestMessage": "updateAlarmInfo",
        "sessionTimeInMinutes": sessionTime,
        "shortBreakTimeInMinutes": sessionBreakTime,
        "longBreakTimeInMinutes": longBreakTime,
        "sessionsBeforeLongBreak": sessionsBeforeLongBreak,
        "timeBeforeResetInMinutes": timeBeforeReset
    },response => { 
        console.log("Works?");
    });
});


loadBlockedSites();
loadAlarmInfo();