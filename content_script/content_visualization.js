class StepTreeVisualization {
    constructor(depth, leaves, previewMaxSize) {
        this.margin = {
            top: 20,
            right: 80,
            bottom: 20,
            left: 80
        };
        // Height and width of popup window
        this.width = depth * 140 - this.margin.right - this.margin.left;
        this.height = leaves * 120 - this.margin.top - this.margin.bottom;
        this.previewMaxSize = previewMaxSize;
        // alert(this.previewMaxSize + '세팅함');

        this.i = 0;
        this.duration = 750;
        this.root = null;

        this.tree = d3.layout.tree()
            .size([this.height, this.width]);

        this.diagonal = d3.svg.diagonal()
            .projection(d => [d.y, d.x]);

        this.svg = d3.select("#visual-history-container")
            .append("svg")
            .attr("width", this.width + this.margin.right + this.margin.left)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


        this.svg2 = d3.select("#visual-history-container")
            .append("div")
            .append("svg2")
            .attr("width", this.width + this.margin.right + this.margin.left)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // .attr("transform", "translate(" + this.margin.left + "," + this.margin.top+100 + ")");

    }

    update(source, current_node) {

        let x = null;
        let y = null;
        let deltaY = null;
        let previewMaxSize = this.previewMaxSize;
        let blackList = [
            'github',
            'gitlab',
            'stackoverflow',
            'codingfactory',
            'developer.chrome',
            'data.go.kr',
            'section.blog',
            'developers.whale'
        ];



        document.addEventListener('mousemove', onMouseUpdate, false);
        document.addEventListener('mouseenter', onMouseUpdate, false);
        document.addEventListener('mousewheel', onMouseWheel, false);

        function onMouseUpdate(e) {
            x = e.pageX;
            y = e.pageY;
        }
        function onMouseWheel(e) {
            deltaY = e.deltaY;
        }
        function getMouseX() {
            return x;
        }
        function getMouseY() {
            return y;
        }

        //////////////////////////////////////////////////////////////
        $("#visual-history-container")
        // 1, 2, 3, 4 사분면
            .css("left", `${window.scrollX}px`)
            .css("top",`${window.scrollY}px`)
            .css("width", `${window.innerWidth - 10}px`)
            .css("height",`${window.innerHeight - 10}px`);

            // 1, 2 사분면
            // .css("left", `${window.scrollX}px`)
            // .css("top",`${window.scrollY}px`)
            // .css("width", `${window.innerWidth - 10}px`)
            // .css("height",`${(window.innerHeight - 10) / 2}px`);

            // 1, 3 사분면
            // .css("left", `${window.scrollX + window.innerWidth/2}px`)
            // .css("top",`${window.scrollY}px`)
            // .css("width", `${(window.innerWidth - 10) / 2}px`)
            // .css("height",`${window.innerHeight - 10}px`);

            // 1 사분면
            // .css("left", `${window.scrollX + window.innerWidth/2}px`)
            // .css("top",`${window.scrollY}px`)
            // .css("width", `${(window.innerWidth - 10) / 2}px`)
            // .css("height",`${(window.innerHeight - 10) / 2}px`);


        // $("#visual-history-container").append(
        //     $('<img>',{id:'setting', src:`${chrome.extension.getURL('icons/step48_blue.png')}`})
        //         .css("left", `${parent.outerWidth}px`)
        //         .css("top",`${parent.outerHeight}px`)
        //         .bind('click', function (evt) {
        //             alert('test');
        //         })
        // );

        var nodes = this.tree.nodes(this.root)
            .reverse();
        var links = this.tree.links(nodes);

        nodes.forEach(function(d) {
            d.y = d.depth * 140;
        });

        var node = this.svg.selectAll("g.node")
        // Make sure all nodes have id's
            .data(nodes, d => d.id || (d.id = ++this.i));

        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on("click", data => this.clickNode(data));

        nodeEnter.append("text")
            .attr("dx", "-1")
            .attr("dy", "+30")
            .attr("text-anchor", 'middle')
            .text((d) => firstNCharacters(d.title))
            .style("fill", "white")
            .style("fill-opacity", 1e-6)
            .call(function(selection) {
                selection.each(function(d) {
                    d.bbox = this.getBBox();
                });
            });

        let nodeUpdate = node.transition()
            .duration(this.duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        let step_blue = chrome.extension.getURL('icons/step48_blue.png');
        let step_yellow = chrome.extension.getURL('icons/step48_yellow.png');
        let step_green = chrome.extension.getURL('icons/step48_green.png');

        nodeEnter.append('image')
            .attr('x', `-${32 / 2.0}px`)
            .attr('y', `-${32 / 2.0}px`)
            .attr('width', `${32}px`)
            .attr('height', `${32}px`)
            .attr('xlink:href', function(d){
                if(d.url  === current_node.url){
                    return step_yellow;
                }else if(d.root) {
                    return step_blue;
                }else{
                    return step_green;
                }
            })
            .attr('class', 'node')
            .on('mouseover', function(e){

                $("#visual-history-container")
                    .bind("scroll", function() {
                        return false;
                    });

                let xOffset = 0;
                let yOffset = 0;


                let preview_img;
                let title;
                let href;
                if(e.url===''){

                    title = "<br/><br/>" + "빈 페이지 입니다.";
                    preview_img = chrome.extension.getURL('icons/thumbnail_default.jpg');
                    href = "";
                }
                else{

                    let c = firstNCharacters(e.title, previewMaxSize+1);
                    title = (c != "") ? "<br/><br/>" + c : "";
                    preview_img = e.image;
                    href = `href="${e.url}" `;
                }

                $("#visual-history-container")
                    .append(`<p id='preview'>
                            <img id="preview_img"
                                 src='${preview_img}'
                                 ${href}
                                 style='width:238px; height:135px; border: solid 1px; border-radius: 2px;' 
                                 alt='Image preview'
                            /> 
                            ${title}
                            </p>`)

                    let pTagMargin = 0;
                    let currentPageUrl = window.location.href;

                    let isBlackListSite = false;

                    for(let i=0; i<blackList.length; i++){
                        isBlackListSite = isBlackListSite || (currentPageUrl).includes(blackList[i])
                    }

                    if(isBlackListSite){
                        pTagMargin = 20;
                    }

                    let textSizeMargin = 0;
                    if(parseInt(previewMaxSize) > 20){
                        textSizeMargin = 30;
                    }

                    /////////////////////////////////////////////////////////////
                    $("#preview")
                        // 1, 2, 3, 4 사분면
                        .css("top",
                            `${ y
                            + ( $("#visual-history-container").scrollTop() - ($("#visual-history-container").scrollTop()/30) )
                            - window.scrollY }px`
                        ).css("left",
                            `${ x
                            + ( $("#visual-history-container").scrollLeft() - ($("#visual-history-container").scrollLeft()/30) )
                            - window.scrollX }px`
                        ).css("width",
                            `${ 242
                            + pTagMargin}px`
                        ).css("height",
                            `${ 160 + textSizeMargin
                            + pTagMargin}px`
                        )

                        // 1, 2 사분면
                        // .css("top", `${y-window.scrollY }px`)
                        // .css("left",`${x-window.scrollX}px`)

                        // 1, 3 사분면
                        // .css("top", `${y-window.scrollY}px`)
                        // .css("left",`${x-window.scrollX - (window.innerWidth/2) }px`)

                        // 1 사분면
                        // .css("top", `${y-window.scrollY}px`)
                        // .css("left",`${x-window.scrollX - (window.innerWidth/2)}px`)

                })
            .on('mouseout', function(e){
                $("#preview").remove();

                $("#visual-history-container")
                    .bind("scroll", function() {
                        return true;
                    });

                //console.log('mouseout 이벤트 발생', e);
            })
            .on('mousemove', function(e){

                $("#visual-history-container")
                    .bind("scroll", function() {
                        return false;
                    });

                let pTagMargin = 0;
                let currentPageUrl = window.location.href;
                let previewWidth = `${ $("#preview").width()}px`;
                let previewHeight = `${ $("#preview").height()}px`;
                let isBlackListSite = false;

                for(let i=0; i<blackList.length; i++){
                    isBlackListSite = isBlackListSite || (currentPageUrl).includes(blackList[i]);
                    // console.log(blackList[i]);
                }

                // console.log(isBlackListSite);

                if(isBlackListSite){
                    previewWidth = `${ 262 }px`;
                    previewHeight = `${ 180 }px`;
                }


                // if((currentPageUrl).includes('github') ||
                //     (currentPageUrl).includes('gitlab') ||
                //     (currentPageUrl).includes('stackoverflow') ||
                //     (currentPageUrl).includes('codingfactory')
                // ) {
                //     previewWidth = `${ 262 }px`;
                //     previewHeight = `${ 180 }px`;
                //
                // }


                /////////////////////////////////////////////////////////////
                $("#preview")
                    // 1, 2, 3, 4 사분면
                    .css("top", `${ y + ( $("#visual-history-container").scrollTop() - ($("#visual-history-container").scrollTop()/30) ) - window.scrollY }px`)
                    .css("left",`${ x + ( $("#visual-history-container").scrollLeft() - ($("#visual-history-container").scrollLeft()/30) )   - window.scrollX }px`)
                    .css("width",previewWidth)
                    .css("height",previewHeight)


                    // 1, 2 사분면
                    // .css("top", `${y-window.scrollY }px`)
                    // .css("left",`${x-window.scrollX}px`)

                    // 1, 3 사분면
                    // .css("top", `${y-window.scrollY}px`)
                    // .css("left",`${x-window.scrollX - (window.innerWidth/2) }px`)

                    // 1 사분면
                    // .css("top", `${y-window.scrollY}px`)
                    // .css("left",`${x-window.scrollX - (window.innerWidth/2)}px`)


                //console.log('mouseover 이벤트 발생', e);
            })
            .on('wheel', function(e){
                //console.log(e);

                $("#visual-history-container")
                    .bind("scroll", function () {
                        return false;
                    });

                let currentPageUrl = window.location.href;
                let isBlackListSite = false;

                for(let i=0; i<blackList.length; i++){
                    isBlackListSite = isBlackListSite || (currentPageUrl).includes(blackList[i]);
                    // console.log(blackList[i]);
                }

                // console.log(isBlackListSite);

                if(isBlackListSite){
                    console.log('마우스 휠 이벤트 방지');

                } else {
                    if (240 <= $("#preview").width() && $("#preview").width() <= 523) {

                        $("#preview").css('width', `${$("#preview").width() - deltaY * 0.1618 }px`);
                        $("#preview").css('height', `${$("#preview").height() - deltaY * 0.1 }px`);

                        $("#preview_img").css('width', `${$("#preview_img").width() - deltaY * 0.1618}px`);
                        $("#preview_img").css('height', `${$("#preview_img").height() - deltaY * 0.1}px`);

                    } else if ($("#preview").width() > 500) {

                        $("#preview")
                            .css("width", `${522}px`)
                            .css("height", `${333}px`)
                        $("#preview_img")
                            .css("width", `${515}px`)
                            .css("height", `${308}px`)

                    } else if (240 > $("#preview").width()) {

                        $("#preview")
                            .css("width", `${242}px`)
                            .css("height", `${160}px`)
                        $("#preview_img")
                            .css("width", `${238}px`)
                            .css("height", `${135}px`)

                    }

                    // console.log($("#preview").width());
                    // console.log($("#preview").height());
                }
            });


        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        let nodeExit = node.exit()
            .transition()
            .duration(this.duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);


        var link = this.svg.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        link.enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("stroke-dasharray", "10, 5")
            .attr("d", (d) => {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return this.diagonal({
                    source: o,
                    target: o
                });
            });

        link.transition()
            .duration(this.duration)
            .attr("d", this.diagonal);

        link.exit()
            .transition()
            .duration(this.duration)
            .attr("d", (d) => {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return this.diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    drawTree(tree, current_node) {
        // Once we've recieved the tree from the background
        // we set the root node's position
        this.root = tree;
        this.root.x0 = this.height / 2;
        this.root.y0 = 0;

        // Then we call the 'update' method to trigger the rest of the visualization
        this.update(this.root, current_node);
    }

    drawHistoryFromStorage(_dict) {
        let _x = 50;

        for (let _key in _dict) {

            _x += 50;
            let step_blue = chrome.extension.getURL('icons/step48_blue.png');
            this.svg2.append("g").append('image')
                .attr('x', `-${32 / 2.0}px`)
                .attr('y', `-${32 / 2.0}px`)
                .attr('width', `${32}px`)
                .attr('height', `${32}px`)
                .attr("id", "preview2")
                .attr('xlink:href', function(d){
                    return step_blue;
                }).attr("transform", function(d) {
                return "translate(" + _x + "," + 100 + ")";
            })
        }
    }

    clickNode(_node) {

        chrome.runtime.sendMessage({
                from: 'content',
                action: 'NodeClick',
                data: {
                    node:{
                        url: _node.url

                    }
                }
            },
        );
        exit(_node.url);

        tellTabToNavigateTo(_node.url);

    }
}


function tellTabToNavigateTo(url) {

    //   tab => {... is shorthand for function(tab) {...
    //   { url } is shorthand for { url: url }
    // getActiveTab(tab => {
    //   chrome.tabs.update(tab.id, { url });
    // });

    window.location.href = url;
}

function firstNCharacters(str, n = 10) {

    if (str.length <= n) {
        return str;
    }

    return str.substr(0, n).trim() + '...';
}
