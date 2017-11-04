var hostName = location.hostname;

function checkIfBlocked() {
    isSessionRunning().then(response => {
        if (response.sessionIsRunningResponse) {
            response.blockedSites.forEach(site => {
                if (site == hostName) {
                    blockThisSite();
                    return;
                }
            });
        }
    });
}
function blockThisSite() {
    document.write(
        '<html>' +
        '<body>' +
        '<h1 style="font-weight: bold;">Site is blocked</p></h1>' +
        '</body>' +
        '</html>');
    document.close();
}
function isSessionRunning() {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ "requestMessage": "isSessionRunning" }, response => {
            resolve(response);
        });
    });
}
/*
function getCurrentUrl() {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ "requestMessage": "getCurrentURL" }, response => {
            resolve(response.currentUrl);
        });
    });
}*/
checkIfBlocked();