/*jslint browser, multivar, white, fudge */
/*global window d3 jtminjsDecorateWithUtilities */

var app = {},  //Global container for application level funcs and values
    jt = {};   //Global access to general utility methods

app = (function () {
    "use strict";

    function loadFonts () {
        //google fonts can occasionally be slow or unresponsive.  Load here
        //to avoid holding up app initialization.  Note that heights of text
        //may change after the fonts load.
        var elem = document.createElement("link");
        elem.rel = "stylesheet";
        elem.type = "text/css";
        elem.href = "//fonts.googleapis.com/css?family=Roboto";
        document.head.appendChild(elem);
        elem = document.createElement("link");
        elem.rel = "stylesheet";
        elem.type = "text/css";
        elem.href = "//fonts.googleapis.com/css?family=Open+Sans";
        document.head.appendChild(elem);
    }


    function extClickHandler (event) {
        var src;
        jt.evtend(event);
        src = event.target || event.srcElement;
        if(src && src.href) {
            window.open(src.href); }
        return false;
    }


    function externalizeLinks () {
        var nodes = document.getElementsByTagName("a");
        Array.prototype.forEach.call(nodes, function (node) {
            if(node.href && node.href.indexOf("http") === 0) {
                jt.on(node, "click", extClickHandler); } });
    }


    function getRectDims(ratio, minw) {
        var rd = {}, marg, over;
        jt.log("window.innerWidth: " + window.innerWidth);
        //figuring 5% right and left margins to avoid getting too tight
        marg = Math.floor(2 * 0.05 * window.innerWidth);
        if(window.innerWidth > 750) {
            //extend margin to 20% if it's a larger display
            marg = Math.floor(2 * 0.2 * window.innerWidth); }
        rd.w = window.innerWidth - marg;
        rd.h = Math.round((rd.w * ratio.h) / ratio.w);
        over = rd.h - window.innerHeight;
        if(over > 0) {  //blew the available height, squish vertically
            rd.w -= Math.floor((over * ratio.w) / ratio.h);
            rd.h = Math.round((rd.w * ratio.h) / ratio.w); }
        if(rd.w < minw) {  //underflowed minimum width, re-expand
            rd.w = minw;
            rd.h = Math.round((rd.w * ratio.h) / ratio.w); }
        return rd;
    }


    function showTextElements() {
        var dur = 600;
        d3.select("#missiondiv").transition().duration(dur)
            .style("opacity", 1.0);
        d3.select("#whatwedodiv").transition().delay(8 * dur).duration(2 * dur)
            .style("opacity", 1.0);
        d3.select("#statusdiv").transition().delay(22 * dur).duration(2 * dur)
            .style("opacity", 1.0);
        d3.select("#casesdiv").transition().delay(26 * dur).duration(2 * dur)
            .style("opacity", 1.0);
    }


    function joinWords(ignore, td, es) {
        var dur = 1200, ab = es.act.node().getBBox();
        es.act.transition().duration(dur)
            .attr("x", 0)
            .attr("y", ab.height)
            .style("opacity", 0.0);
        es.info2.transition().duration(dur)
            .attr("x", Math.round(ab.width - (0.2 * ab.width)))
            .attr("y", ab.height)
            .style("opacity", 0.0);
        es.ai = es.g.append("text")
            .attr("class", "titleword")
            .attr("x", 0)
            .attr("y", ab.height)
            .attr("font-size", td.fs2)
            .text("ActInform")
            .style("opacity", 0.0);
        es.ai.transition().delay(300).duration(dur - 300)
            .style("opacity", 1.0);
        setTimeout(function () {
            jt.byId("titsvg").style.height = Math.round(1.2 * ab.height) + "px";
            externalizeLinks();
            showTextElements(); }, dur);
    }


    function shrinkWords(rd, td, es) {
        es.act.transition().duration(600)
            .attr("font-size", td.fs2);
        es.info2.transition().duration(600)
            .attr("font-size", td.fs2);
        setTimeout(function () {
            joinWords(rd, td, es); }, 650);
    }


    function stabilizeWords(rd, td, es) {
        var ib = es.inform.node().getBBox();
        es.inform.transition().duration(300)
            .style("opacity", 0.0);
        es.info2 = es.g.append("text")
            .attr("class", "titleword")
            .attr("x", ib.x + 1)  //avoid slight shift left
            .attr("y", td.y2)
            .attr("font-size", td.fs)
            .text("Inform.")
            .style("opacity", 0.0);
        es.info2.transition().duration(300)
            .style("opacity", 1.0);
        setTimeout(function () {
            shrinkWords(rd, td, es); }, 350);
    }


    function displayAnimatedTitle (rd) {
        var td, es = {};
        td = {fs:Math.round(0.4 * rd.h),
              fs2:Math.round(0.15 * rd.h),
              x1:10,
              y1:Math.round(0.4 * rd.h),
              y2:Math.round(0.84 * rd.h)};
        es.g = d3.select("#titsvg").append("g");
        es.act = es.g.append("text")
            .attr("id", "tact")
            .attr("class", "titleword")
            .attr("x", rd.w)
            .attr("y", td.y1)
            .attr("font-size", Math.round(0.5 * td.fs))
            .text("Act.")
            .style("opacity", 0.0);
        es.act.transition().duration(600)
            .style("opacity", 1.0)
            .attr("font-size", td.fs)
            .attr("x", td.x1);
        es.inform = es.g.append("text")
            .attr("id", "tinform")
            .attr("class", "titleword")
            .attr("text-anchor", "end")
            .attr("x", td.x1)
            .attr("y", td.y2)
            .attr("font-size", Math.round(0.5 * td.fs))
            .text("Inform.")
            .style("opacity", 0.0);
        es.inform.transition().delay(600).duration(600)
            .style("opacity", 1.0)
            .attr("font-size", td.fs)
            .attr("x", rd.w);
        setTimeout(function () {
            stabilizeWords(rd, td, es); }, 1600);
    }


    function displayDescription () {
        var rd, cname = "eric", chost = "epinova.com";
        rd = getRectDims({w:3, h:2}, 300);
        jt.out("titdiv", jt.tac2html(
            ["svg", {id:"titsvg", width:rd.w, height:rd.h}]));
          jt.out("statusdiv", jt.tac2html(
              ["table", {id:"statustable"},
               [["tr", {id:"statrow"},
                 [["td", {cla:"statlab"}, "Status:"],
                  ["td", {cla:"statval"}, "Assembling."]]],
                ["tr", {id:"updrow"},
                 [["td", {cla:"statlab"}, ""],
                  ["td", {cla:"statval", colspan:2}, 
                   ["For info, ",
                    ["a", {href:"mailto:" + cname + "@" + chost},
                     "email " + cname]]]]]]]));
        displayAnimatedTitle(rd);
    }


    function displayHome () {
        displayDescription();
    }


return {
    init: function () {
        jtminjsDecorateWithUtilities(jt);
        setTimeout(loadFonts, 50);
        setTimeout(displayHome, 75);
    }
};
}());
        
