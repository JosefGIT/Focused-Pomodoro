const GREEN = [34, 139, 34, 255];
const RED = [200, 0, 0, 255];

chrome.browserAction.onClicked.addListener(() => {
    startNextAlarm();
});

function startNextAlarm() {
    switch (_alarmState) {
        case NO_STATE: // If NO_STATE or START_SESSION_NEXT run startSessionAlarm().
        case START_SESSION_NEXT:
            startSessionAlarm();
            break;
        case START_SHORT_BREAK_NEXT:
            startShortBreakAlarm();
            break;
        case START_LONG_BREAK_NEXT:
            startLongBreakAlarm();
            break;
    }
}

var _badgeTimer;
var _noActivityTimer;
const NO_ACTIVITY_BEFORE_RESET_IN_MS = 10000;
const REPEAT_TIMER_TIME_IN_MS = 10000;

function activateTimer() {
    clearInterval(_noActivityTimer);
    badgeBackgroundColor();
    setBadgeTextTime();
    _badgeTimer = setInterval(() => {
        setBadgeTextTime();
    }, REPEAT_TIMER_TIME_IN_MS);
}
function deactivateTimer() {
    chrome.browserAction.setBadgeText({ "text": "......" });
    clearInterval(_badgeTimer);
    badgeBackgroundColor();
    activateNoActivityTimer()
}

function activateNoActivityTimer() {
    _noActivityTimer = setInterval(() => {
        resetCycle();
    }, NO_ACTIVITY_BEFORE_RESET_IN_MS);
}

function resetCycle() {
    // Clears alarm and interval if they exists
    // Currently does not check for existence since it does not cause any error for clearing non-existent alarms/intervals
    chrome.alarms.clearAll();
    clearInterval(_badgeTimer);

    resetSessionNumber();
    _alarmState = NO_STATE;
    chrome.browserAction.setBadgeText({ "text": "" });
}

function setBadgeTextTime() {
    alarmTimeLeftInMinutes().then(timeLeft => {
        if (timeLeft != null)
            chrome.browserAction.setBadgeText({ "text": timeLeft + "min." });
    });
}

// Decides which color the badge background should be, then sets it
function badgeBackgroundColor() {
    switch (_alarmState) {
        case NO_STATE:
        case START_SESSION_NEXT:
            setBadgeBackgroundColor(RED);
            break;
        case START_SHORT_BREAK_NEXT:
            setBadgeBackgroundColor(GREEN);
            break;
        case START_LONG_BREAK_NEXT:
            setBadgeBackgroundColor(GREEN);
            break;
    }
}

//	34-139-34 #228b22
function setBadgeBackgroundColor(RGBAArray) {
    chrome.browserAction.setBadgeBackgroundColor({ color: RGBAArray });
}

