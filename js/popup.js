//only executes when document is ready 
document.addEventListener('DOMContentLoaded', function() {
    //identifies HTML elements in popup that will be used
    var form = document.getElementById('textField');
    var submitButton = document.getElementById('submitButton');
    //creates queryInfo object for query request on line 11
    var queryInfo = {
      active: true,
      currentWindow: true
    };
    //gets information from tab and injects JS onto webpage
    chrome.tabs.query(queryInfo, function(tabs) { 
      submitButton.addEventListener("click", function() {
        var newTitle = form.value; 
        chrome.tabs.executeScript({
          code: 'document.title=' + JSON.stringify(newTitle)
        });
      });
    });
    chrome.tabs.query(queryInfo, function(tabs){
        submitButton.addEventListener("keydown", function (e) {
            if (e.keycode === 13) {
            var newTitle = form.value; 
            chrome.tabs.executeScript({
              code: 'document.title=' + JSON.stringify(newTitle)
        });
      }
    });    
  });
});



document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('buttonT');
    var titleState = {};

    // onClick's logic below:
    button.addEventListener('click', function () {
        chrome.tabs.query({
            currentWindow: true
        }, function (tabs) {
            if (tabs.length > 0) {
                for (var i = 0; i < tabs.length; ++i) {
                    var tab = tabs[i];
                    titleState[tab.id] = tab.title;
                }
                sortByState(tabs, -1, titleState);
                moveTabs(tabs);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('buttonU');
    var state = chrome.extension.getBackgroundPage().tabState;

    // onClick's logic below:
    button.addEventListener('click', function () {
        chrome.tabs.query({
            currentWindow: true
        }, function (tabs) {
            if (tabs.length > 0) {
                sortByState(tabs, 1, state);
                moveTabs(tabs);
            }
        })
    });
});

function sortByState(tabs, reverse, state) {
    tabs.sort(function (a, b) {
        // comparison values
        var keyA = state[a.id],
            keyB = state[b.id];
        if (keyA < keyB) return reverse * 1;
        if (keyA > keyB) return reverse * -1;
        return 0;
    });
}

function moveTabs(tabs) {
    for (var i = 0; i < tabs.length; ++i) {
        // Current tab is pinned, so decrement the tabIndex by one.
        chrome.tabs.move(tabs[i].id, {
            index: i
        });
    }
}