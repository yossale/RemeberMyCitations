/*
 This script is the one that's loaded every time a page is updated.
 It's responsible to put links on all the results.
 */

var citationViewer = new CitationsViewer();
fixMainElementWidth();
addLinksToSearchResults();

function fixMainElementWidth() {
    document.getElementById("gs_ccl").style.maxWidth = "600px";
    $('div.gs_ggs').css({'left':'620px', 'white-space':'normal'});
}

function clearCitations() {
    console.log("Clicked on clear");
    citationViewer.clearAll();
}

function addLinksToSearchResults() {

    var entries = document.getElementsByClassName("gs_ri");

    for (var i = 0, tot = entries.length; i < tot; i++) {
        console.log("Added " + i + " entries");
        var linksDiv = entries[i].getElementsByClassName("gs_fl")[0];
        linksDiv.appendChild(generateEntry(linksDiv));
    }
}

function generateEntry(innerEntry) {

    var a = document.createElement('a');
    var linkText = document.createTextNode("Add to my articles");
    a.appendChild(linkText);
    a.onclick = function () {
        var entry = generateBibtexUrl(innerEntry);
        citationViewer.addArticle(entry);
    };

    a.href = "#";
    return a
}

function generateBibtexUrl(linksDiv) {
    //Get all the "a" elements within the div
    var as = linksDiv.getElementsByTagName("a")
    //Convert from nodelist to array, so we can filter
    var arr = Array.prototype.slice.call(as)
    //Get the one containing the Cite
    var cite = arr.filter(function (curElem) {
        return curElem.text.toUpperCase() == "Cite".toUpperCase()
    })

    var functionCallString = (!cite[0].getAttribute("data-a") ? "" : cite[0].getAttribute("data-a")) + (!cite[0].getAttribute("onclick") ? "" : cite[0].getAttribute("onclick"))

    var paperId = getPaperId(functionCallString)

    return {
        'articleKey': paperId,
        'url': "http://scholar.google.co.il/scholar?q=info:" + paperId + ":scholar.google.com/&output=cite&hl=en"
    }
}

function getPaperId(str) {
    var myRegexp = /gs_ocit\(.+,'([A-Za-z0-9_-]{12,})'\)/g;
    var match = myRegexp.exec(str);
    return(match[1]);
}



