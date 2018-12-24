function areSameNode(node1, node2) {
    return node1.url === node2.url;
}

function treeHasVisited(r, n) {
    if (areSameNode(n, r)) {
        return r;
    }
    else {
        for (let i = 0; i < r.children.length; i++) {
            let visitedNode = treeHasVisited(r.children[i], n);
            if (visitedNode){
                return visitedNode;
            }
        }
    }
    return false;
}

function updateNodeImageByUrl(root, url, img) {

    let targetNode = undefined;
    if (root.url === url) {
        // img 수정 동작
        root.image = img;
        return root;
    }
    else {

        for (let i = 0; i < root.children.length; i++) {
            targetNode = updateNodeImageByUrl(root.children[i], url, img);
            if (targetNode){
                return targetNode;
            }
        }

        return targetNode;
    }
}

function depthOf(r, d) {
    d++;
    if (isLeaf(r)) {
        return d;
    }
    else{
        let children_depths = r.children.map(function(x){return depthOf(x, d);});
        return Math.max.apply( Math, children_depths);
    }
}

function widthOf(r, w) {
    if (isLeaf(r)) {
        return 1;
    }
    else {
        let current_width = w;
        r.children.forEach(function(c){ w += widthOf(c, current_width); })
    }
    return w;
}

function isLeaf(r) {
    return (r.children.length === 0);
}
