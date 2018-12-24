class StepTreeStorage {

    constructor() {
        this.rootsDict = {
            // tabId: tree
        };
    }

    updateNodeImageByNodeInfo(tabId, url, img){
        // 매개변수로 넘어온 tabId 와 url 을 갖는 노드를 찾아 매개변수로 넘어온 img 로 변경

        if (tabId in this.rootsDict) {

            let targetTree = this.rootsDict[tabId].root;
            updateNodeImageByUrl(targetTree, url, img);

        }

        this.save();
    }

    updateNodeByNodeUrl(tabId, url, node) {

        if (tabId in this.rootsDict) {

            let _rootNode = this.rootsDict[tabId].root;

            StepTreeStorage.getNodeByUrl(_rootNode, url, function (_node) {

                _node.title = node.title;

            });
        }
        this.save();
    }

    static getNodeByUrl(node,  url, callback) {

        node.children.forEach(function(_node){
            if(_node.url === url) {

                callback(_node);
            }
            else {

                StepTreeStorage.getNodeByUrl(_node, url, callback);
            }
        });
    }

    insertNodeIntoTreeByTabId(node, tabId) {
        node.children = node.children || [];

        if (!(tabId in this.rootsDict)) {
            // Create a new tree for the tab
            this.rootsDict[tabId] = {
                root: node,
                currentNode: node,
                depth: 1,
                width: 1
            };

            node.root = true;
            if(node.url === 'chrome://newtab/')
                node.url = '';
        }
        else {
            let visitedNode = treeHasVisited(this.rootsDict[tabId].root, node);

            if (visitedNode) {

                chrome.tabs.captureVisibleTab(null, {format: "jpeg", quality: 10}, function (img) {
                    visitedNode.image = img;

                });
                if (node.move) {
                    this.rootsDict[tabId].currentNode = visitedNode;
                }
            }
            else {

                this.rootsDict[tabId].currentNode.children.push(node);


                if (node.move) {
                    this.rootsDict[tabId].currentNode = node;
                }
            }

            this.rootsDict[tabId].depth = depthOf(this.rootsDict[tabId].root, 0);
            this.rootsDict[tabId].width = widthOf(this.rootsDict[tabId].root, 0);
        }

        this.save();
    }

    getStepTreeForTabId(tabId) {
        return this.rootsDict[tabId];
    }

    save() {
        chrome.storage.local.set({'log':this.rootsDict}, function() {});
    }
}
