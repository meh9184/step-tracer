getActiveTab(activeTab => {

    chrome.runtime.sendMessage({
            from: 'browser_action',
            action: 'get-tree',
            data: {
                tab: activeTab
            }
        },
        (getTreeResponse) => {


        });

    close();

});
function getActiveTab(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {

        if(tabs[0].url.startsWith('chrome://') || tabs[0].url.startsWith('https://store.whale.naver.com')) {
            let _image = document.createElement('img');
            // document.body.setAttribute('width', '242px');
            // document.body.setAttribute('height', '150px');

            _image.setAttribute('src',chrome.extension.getURL('icons/thumbnail_forbidden.jpg'));
            _image.setAttribute('width','323px');
            _image.setAttribute('height','200px');
            document.body.appendChild(_image);

            // Message('In this page');
            // Message('Do not working');
            setTimeout(() => {close()},2000);
        }
        else if(tabs[0].status === 'loading') {

            Message('Loading...');
            setTimeout(() => {getActiveTab(callback)}, 1000);

        } else {

            callback(tabs[0]);

        }
    });
}
function Message(message) {
    let errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);


}