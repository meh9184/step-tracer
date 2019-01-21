const stepTreeStorage = new StepTreeStorage();
let image;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {



    if (request.from === 'browser_action') {
        if (request.action === 'get-tree') {
            chrome.tabs.get(request.data.tab.id, tab => {
                if (tab.status === 'complete') {

                    chrome.tabs.sendMessage(request.data.tab.id, {
                        'current':stepTreeStorage.getStepTreeForTabId(request.data.tab.id),
                        'previewMaxSize':stepTreeStorage.previewMaxSize
                    });

                    // console.log('browser_action : ' + stepTreeStorage.previewMaxSize + '보냄');

                }
            });
        }
    }

    else if(request.from === 'content') {
        if (request.action === 'beforeunload') {

            chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 10}, function (img) {
                let tabId = sender.tab.id;
                let url = request['url'];

                stepTreeStorage.updateNodeImageByNodeInfo(tabId, url, img);

            });
        }
        else if (request.action === 'NodeClick') {


        } else { console.log("ERROR", request); }
    }

    else if (request.from === 'option_page') {
        if (request.action === 'change-options') {

            stepTreeStorage.previewMaxSize = request.data.previewMaxSize;

        }
    } else { console.log("ERROR", request);}


});

// Listens for changes to tabs to see when pages are loaded
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status === 'complete') {


        let _data = {
            move:true,
            url: tab.url,
            title: tab.title,
            favIconUrl: tab.favIconUrl,
            image: chrome.extension.getURL("icons/thumbnail_default.jpg"),
            root: false
        };

        if (tab.url.startsWith("chrome://")) {



        }
        else {

            stepTreeStorage.insertNodeIntoTreeByTabId(_data, tab.id);

            setTimeout(function(){ chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 10}, function (img) {

                _data.image = img;

            });
            }, 800);

            chrome.tabs.sendMessage(tabId, {'action': 'image', 'img':image});

        }
    }
    else if (changeInfo.status === 'loading') {

    }
    else
    {
        stepTreeStorage.updateNodeByNodeUrl(tabId, tab.url, {
            title: tab.title,

        });

    }

});


chrome.commands.onCommand.addListener(command => {
    chrome.tabs.query({active: true, currentWindow: true}, activeTabs => {
        const id = activeTabs[0].id;
        if(command == 'action') {

            chrome.tabs.sendMessage(id, stepTreeStorage.getStepTreeForTabId(id));


        }
    });


    console.log(command);
});

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
    title: "Step Tracer 에 추가",
    contexts: ["link"],
    onclick: (info, tab) => {
        if (info.linkUrl) {

            let _data = {
                move:false,
                url: info.linkUrl,
                title: '',
                favIconUrl: "",
                image: chrome.extension.getURL("icons/thumbnail_default.jpg"),
                root: false
            };
            let xhr = new XMLHttpRequest();
            xhr.open("GET", info.linkUrl, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {

                    if (info.selectionText) {

                        _data.title = info.selectionText;

                    }
                    else {
                        let parser = new DOMParser();
                        let xmlDoc = parser.parseFromString(xhr.responseText,"text/xml");

                        if (xmlDoc.getElementsByTagName('title')[0]) {

                            _data.title = xmlDoc.getElementsByTagName('title')[0].textContent;
                        }
                        else {

                            let parser = document.createElement('a');
                            parser.href = info.linkUrl;

                            let _arr = parser.hostname.split(".");
                            if (_arr.length === 2) {

                                _data.title = _arr[0];

                            }
                            else if(_arr.length === 3 ) {
                                if(_arr[0] === 'www') {

                                    _data.title = _arr[1];

                                }
                                else {

                                    _data.title = _arr[0];

                                }
                            } else {

                                _data.title = _arr[1];


                            }
                        }
                    }
                    _data.url = xhr.responseURL;
                    stepTreeStorage.insertNodeIntoTreeByTabId(_data, tab.id);
                }
            };
            xhr.send();



        }
    }
});