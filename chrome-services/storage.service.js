function getBlockedSites() {
    return new Promise(resolve => {
        chrome.storage.sync.get({
            "blockedSites": []
        }, items => {
            resolve(items.blockedSites);
        });
    });
}
function blockSite(siteURL) {
    siteIsBlocked(siteURL).then(siteIsBlocked => {
        if (siteIsBlocked) {
            console.info("This site is already blocked during pomodoro session!");
        } else {
            getBlockedSites().then(blockedSites => {
                if (typeof siteURL === "string") {
                    blockedSites.push(siteURL);
                    chrome.storage.sync.set({
                        "blockedSites": blockedSites
                    }, () => {
                        console.info(siteURL + " is now blocked during pomodoro session!");
                    });
                } else {
                    console.error("Site URL is not a string!");
                }
            });
        }
    });
}

function updateBlockedSites(newBlockedSites) {
    return new Promise(resolve => {
        chrome.storage.sync.set({
            "blockedSites": newBlockedSites
        }, () => resolve("updated"));
    });
}
function siteIsBlocked(siteURL) {
    return new Promise(resolve => {
        getBlockedSites().then(blockedSites => {
            blockedSites.forEach(blockedSiteURL => {
                if (siteURL == blockedSiteURL) {
                    resolve(true);
                }
            });
            resolve(false);
        });
    });
}

function getSessionAlarmInfo() {
    return new Promise(resolve => {
        chrome.storage.sync.get({
            "sessionTimeInMinutes": 0.4
        }, items => {
            resolve({
                "sessionTimeInMinutes": items.sessionTimeInMinutes
            });
        });
    });
}

function getBreakAlarmInfo() {
    return new Promise(resolve => {
        chrome.storage.sync.get({
            "shortBreakTimeInMinutes": 0.2,
            "longBreakTimeInMinutes": 0.4,
            "sessionsBeforeLongBreak": 4,
            "currentSessionNumber": 0
        }, items => {
            resolve({
                "shortBreakTimeInMinutes": items.shortBreakTimeInMinutes,
                "longBreakTimeInMinutes": items.longBreakTimeInMinutes,
                "sessionsBeforeLongBreak": items.sessionsBeforeLongBreak,
                "currentSessionNumber": items.currentSessionNumber
            });
        });
    });
}

function incrementCurrentSessionNumber() {
    getBreakAlarmInfo().then(alarmInfo => {
        //var incrementedNumber = parseInt(alarmInfo.currentSessionNumber)+1;
        chrome.storage.sync.set({
            "currentSessionNumber": alarmInfo.currentSessionNumber + 1
        });
    });
}

function resetSessionNumber() {
    chrome.storage.sync.set({
        "currentSessionNumber": 0
    });
}

/*
function getAlarmInfo(alarm){
    return new Promise(resolve => {
        chrome.storage.sync.get({
            "sessionTimeInMinutes": 0.1
        }, items => {
            resolve({
                "delayInMinutes": items.sessionTimeInMinutes
            });
        });
    });
}*/