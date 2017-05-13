/*jslint browser, multivar, white, fudge */
/*global window jtminjsDecorateWithUtilities */

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
        var elem = document.createElement("link");
        elem.rel = "stylesheet";
        elem.type = "text/css";
        elem.href = "//fonts.googleapis.com/css?family=Open+Sans";
        document.head.appendChild(elem);
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


    function displayAnimatedTitle (rd) {
        var g, td, act;
        td = {fs:Math.round(0.4 * rd.h),
              y1:Math.round(0.4 * rd.h),
              y2:Math.round(0.84 * rd.h)};
        g = d3.select("#titsvg").append("g");
        act = g.append("text")
            .attr("class", "titleword")
            .attr("x", rd.w)
            .attr("y", td.y1)
            .attr("font-size", Math.round(0.5 * td.fs))
            .text("Act.")
            .style("opacity", 0.0)
            .transition().duration(600)
            .style("opacity", 1.0)
            .attr("font-size", td.fs)
            .attr("x", 10);
        g.append("text")
            .attr("class", "titleword")
            .attr("text-anchor", "end")
            .attr("x", 10)
            .attr("y", td.y2)
            .attr("font-size", Math.round(0.5 * td.fs))
            .text("Inform.")
            .style("opacity", 0.0)
            .transition().delay(600).duration(600)
            .style("opacity", 1.0)
            .attr("font-size", td.fs)
            .attr("x", rd.w);
    }


    function displayDescription () {
        var html, rd, dur = 600, bd = 2000, cname = "eric", 
            chost = "epinova.com";
        rd = getRectDims({w:3, h:2}, 300);
        html = [["div", {id:"titdiv"},
                 ["svg", {id:"titsvg", width:rd.w, height:rd.h}]],
                ["div", {id:"missiondiv", style:"opacity:0.0;"},
                 "Our mission is to provide free and unique information tools amplifying the impact of those working for social justice."],
                ["div", {id:"statusdiv", style:"opacity:0.0;"},
                 ["table", {id:"statustable"},
                  [["tr", {id:"statrow"},
                    [["td", {cla:"statlab"}, "Status:"],
                     ["td", {cla:"statval"}, "Assembling."]]],
                   ["tr", {id:"updrow"},
                    [["td", {cla:"statlab"}, ""],
                     ["td", {cla:"statval", colspan:2}, 
                      ["To get involved, or for more information, ",
                       ["a", {href:"mailto:" + cname + "@" + chost},
                        "contact " + cname]]]]]]]]];
        jt.out("maindiv", jt.tac2html(html));
        displayAnimatedTitle(rd);
        d3.select("#missiondiv").transition().delay(bd + 100).duration(dur)
            .style("opacity", 1.0);
        d3.select("#statusdiv").transition().delay(bd + 3600).duration(dur)
            .style("opacity", 1.0);
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
}}());
        
