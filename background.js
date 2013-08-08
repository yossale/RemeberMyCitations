debugger;
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

        var key = "userCitationsMap";

        if (request.type == "getOrCreate") {
            chrome.storage.local.get(key, function (items) {
                if (items[key]) {
                    sendResponse(items[key])
                } else {
                    var curMap = new Hashtable();
                    curMap.put("APA", new Hashtable());
                    curMap.put("MLA", new Hashtable());
                    curMap.put("Chicago", new Hashtable());

                    chrome.storage.local.set({key: curMap}, function (response) {
                        sendResponse(curMap);
                        console.log("Added new citationMap to storage");
                    });
                }
            });
        } else if (request.type == "addCitation") {



        } else {
            console.error("No such request type: " + request.type)
        }

        sendResponse({farewell: "goodbye"});
    });
;