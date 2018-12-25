let SELECTING = false;
let svg = null;


const container = document.createElement('div');

container.id = 'visual-history-container';

if (document.body.firstChild)
    document.body.insertBefore(container, document.body.firstChild);
else
    document.body.appendChild(container);

container.onclick = e => exit(false);
document.documentElement.onkeydown = e => {
    const key = e.keyCode || e.which;
    // exit on Escape down
    if (key === 27 || e.code === 'Escape') exit();
};


function exit() {

    // let elements = document.getElementsByTagName('svg');
    //
    // for (let elem of elements) {
    //
    //     elem.remove();
    //
    // }

    let visual_history_container = document.getElementById('visual-history-container');

    visual_history_container.innerHTML = '';
    container.className = '';
    svg = null;
    document.body.classList.remove('visual-history-freeze');

    container.style.opacity = '0';

    SELECTING = !SELECTING;

}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {


    if(data['action'] == 'image') {

    }
    else {


        if(false){

            svg = d3_selection.select('#visual-history-container')
                .append('svg')
                .attr('width', 100)
                .attr('height', 100)
                .attr('id', 'visual-history-svg')
                .append('g');

            // const links = svg.selectAll('path').data(data.links, link => link.id);
            // links.enter().append('line')
            //     .attr("class", "visual-history-link")
            //     .attr("x1", link => link.source.x)
            //     .attr("y1", link => link.source.y)
            //     .attr("x2", link => link.target.x)
            //     .attr("y2", link => link.target.y);

            const nodes = svg.selectAll('g').data(data.root, node => node.id);
            const createNode = nodes.enter().append('g')
                .attr('transform', node => `translate(${node.position.x},${node.position.y})`)
                .classed('visual-history-current', node => node.id === data.current.id)
                .classed('visual-history-preview', node => node.data.preview)
                .classed('visual-history-node', true)
                .attr('id', node => `visual-history-id-${node.id}`)
                .on('click', click);
        }
        else {

            document.body.classList.add('visual-history-freeze');
            container.className = 'visual-history-container-visible';

            container.style.setProperty("top", String(document.body.scrollTop) + 'px', "important");
            container.style.setProperty("left", String(document.body.scrollLeft) + 'px', "important");
            container.style.opacity = '1';

            if(SELECTING) {

                exit(false);

            }
            else {

                const stepTreeVisualization = new StepTreeVisualization(data['current'].depth, data['current'].width);
                stepTreeVisualization.drawTree(data['current'].root, data['current'].currentNode);

                SELECTING = !SELECTING;

                // chrome.storage.local.get(['log'], function(result) { stepTreeVisualization.drawHistoryFromStorage(result['log']);});

            }
        }
    }
});





window.addEventListener("beforeunload", function (event) {


    function syncFunction(callback){
        exit(window.location.href);

        if(typeof callback === 'function') {
            setTimeout(callback(), 1000);

        }

    }

    syncFunction(function(){
        chrome.runtime.sendMessage({
            from:'content',
            action:'beforeunload',
            'url': window.location.href},
            (response)=> {});
    });

});
