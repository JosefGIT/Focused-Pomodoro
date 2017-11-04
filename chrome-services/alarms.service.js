const sessionAlarmName = "SESSION_ALARM";
const shortBreakAlarmName = "BREAK_ALARM";
const longBreakAlarmName = "LONG_BREAK";
// This function should be executed whenever an alarm has been started
function createChromeAlarm(alarmName, delayInMinutes, alarmState) {
    chrome.alarms.create(alarmName, { "delayInMinutes": delayInMinutes });
    activateTimer();
    _alarmState = alarmState;
}
function startSessionAlarm() {
    getSessionAlarmInfo().then(alarmInfo => {
        createChromeAlarm(sessionAlarmName, alarmInfo.sessionTimeInMinutes, SESSION_ALARM_IS_RUNNING);
        incrementCurrentSessionNumber();
    });
}

function stopSessionAlarm() {
}
function startShortBreakAlarm() {
    getBreakAlarmInfo().then(alarmInfo => {
        createChromeAlarm(shortBreakAlarmName, alarmInfo.shortBreakTimeInMinutes, BREAK_ALARM_IS_RUNNING);
    });
}

function stopShortBreakAlarm() {
}

function startLongBreakAlarm() {
    getBreakAlarmInfo().then(alarmInfo => {
        createChromeAlarm(longBreakAlarmName, alarmInfo.longBreakTimeInMinutes, BREAK_ALARM_IS_RUNNING);
        resetSessionNumber();
    });

}

function stopLongBreakAlarm() {
}

function alarmTimeLeftInMinutes() {
    return new Promise(resolve => {
        chrome.alarms.getAll(alarms => {
            console.log("Alarms:");
            console.log(alarms);
            if (alarms.length == 0)
                resolve(null);
            else {
                var remainingAlarmTimeInMinutes = Math.ceil((alarms[0].scheduledTime - Date.now()) / (1000 * 60));
                resolve(remainingAlarmTimeInMinutes);
            }
        });
    });
}

const NO_STATE = 0;
const SESSION_ALARM_IS_RUNNING = 1;
const BREAK_ALARM_IS_RUNNING = 2;
const START_SESSION_NEXT = 3;
const START_SHORT_BREAK_NEXT = 4;
const START_LONG_BREAK_NEXT = 5;
var _alarmState = NO_STATE;

function onAlarmListener() {
    chrome.alarms.onAlarm.addListener(alarmInfo => {
        switch (alarmInfo.name) {
            case sessionAlarmName:
                stopSessionAlarm();
                getBreakAlarmInfo().then(breakAlarmInfo => {
                    if (breakAlarmInfo.currentSessionNumber >= breakAlarmInfo.sessionsBeforeLongBreak)
                        _alarmState = START_LONG_BREAK_NEXT;
                    else
                        _alarmState = START_SHORT_BREAK_NEXT;

                    deactivateTimer();
                });
                break;

            case shortBreakAlarmName:
                stopShortBreakAlarm();
                _alarmState = START_SESSION_NEXT;
                deactivateTimer();
                break;

            case longBreakAlarmName:
                stopLongBreakAlarm();
                _alarmState = START_SESSION_NEXT;
                deactivateTimer();
                break;
        }
        alarmStopNotification(alarmInfo.name);

    });
}
onAlarmListener();