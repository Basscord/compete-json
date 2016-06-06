"use strict";
var steps=[];
var testindex = 0;
var loadInProgress = false; //This is set to true when a page is still loading

var args = require('system').args;
var webPage = require('webpage');
var site = args[1];
var page = webPage.create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;

steps = [

    //Step 1 - Open login page
    function(){
        page.open("https://app.compete.com/login", function (status) {});
    },
    //Step 2 - Click Login
    function(){
        page.evaluate(function(){
            document.getElementById("login_email").value = "YOUR_COMPETE_PRO_USERNAME";
            document.getElementById("login_password").value = "YOUR_COMPETE_PRO_PASSWORD";
            document.querySelector(".at_login_submit").click();
        });
    },
    //Step 3 - Make jQuery data request
    function(){
        page.evaluate(function(site) {
            $j.get("https://app.compete.com/metrics/async/charts/"+site+"/uv+pv/3m/", function(data){
                console.log(JSON.stringify(data));
                console.log("Ok done now.")
            });
        }, site);
    }
];

//Execute steps one by one
var interval = setInterval(executeRequestsStepByStep, 50);
 
function executeRequestsStepByStep(){
    if (loadInProgress == false && typeof steps[testindex] == "function") {
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        clearInterval(interval);
    }
}

/**
 * These listeners are very important in order to phantom work properly. Using these listeners, we control loadInProgress marker which controls, weather a page is fully loaded.
 * Without this, we will get content of the page, even a page is not fully loaded.
 */
page.onLoadStarted = function() {
    loadInProgress = true;
};
page.onLoadFinished = function() {
    loadInProgress = false;
};
page.onConsoleMessage = function(msg) {
    if(msg === "Ok done now.") {
        phantom.exit();
    } else {
        console.log(msg);
    }
};

/*

DEBUG:

page.onResourceRequested = function (request) {
    console.log('= onResourceRequested()');
    console.log('  request: ' + JSON.stringify(request, undefined, 4));
};

page.onResourceReceived = function(response) {
    console.log('= onResourceReceived()' );
    console.log('  id: ' + response.id + ', stage: "' + response.stage + '", response: ' + JSON.stringify(response));
};

page.onLoadStarted = function() {
    console.log('= onLoadStarted()');
    var currentUrl = page.evaluate(function() {
        return window.location.href;
    });
    console.log('  leaving url: ' + currentUrl);
};

page.onLoadFinished = function(status) {
    console.log('= onLoadFinished()');
    console.log('  status: ' + status);
};

page.onNavigationRequested = function(url, type, willNavigate, main) {
    console.log('= onNavigationRequested');
    console.log('  destination_url: ' + url);
    console.log('  type (cause): ' + type);
    console.log('  will navigate: ' + willNavigate);
    console.log('  from page\'s main frame: ' + main);
};

page.onResourceError = function(resourceError) {
    console.log('= onResourceError()');
    console.log('  - unable to load url: "' + resourceError.url + '"');
    console.log('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
};

page.onError = function(msg, trace) {
    console.log('= onError()');
    var msgStack = ['  ERROR: ' + msg];
    if (trace) {
        msgStack.push('  TRACE:');
        trace.forEach(function(t) {
            msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }
    console.log(msgStack.join('\n'));
};
*/
