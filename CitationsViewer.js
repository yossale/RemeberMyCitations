function CitationsViewer() {
    this.versions = ["APA", "MLA", "Chicago"];
    var start = Date.now()
    this.citationsMap = new CitationsRepository();
    this.buildBibtexPane();
    console.log("Finished loading");
}

CitationsViewer.prototype.addArticle = function (articleInfo) {
    var self = this;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var citePage = document.createElement('div');
            citePage.innerHTML = xmlhttp.responseText;
            self.addCitations(articleInfo.articleKey, citePage);
            self.refreshCiteList(self.citationsMap);
        }
    }

    xmlhttp.open("GET", articleInfo.url, true);
    xmlhttp.send();

    console.log("Function called for: " + articleInfo.url)
}

//Build the cite pane
CitationsViewer.prototype.buildBibtexPane = function () {
    var self = this;
    $('#gs_res_bdy').prepend('<div id="citeListWrapper"></div>');

    $.get(chrome.extension.getURL("citations.html"), function(data) {
        var start = Date.now();
        console.log("Building the tabs started");

        //Paint the tabs pane
        $('#citeListWrapper').html(data);

        $(document).ready(function () {
            var activeTabIndex = -1;
            var tabNames = ["apa", "mla", "chicago"];

            $(".tab-menu > li").click(function (e) {
                for (var i = 0; i < tabNames.length; i++) {
                    if (e.target.id == tabNames[i]) {
                        activeTabIndex = i;
                    } else {
                        $("#" + tabNames[i]).removeClass("active");
                        $("#" + tabNames[i] + "_tab").css("display", "none");
                    }
                }
                $("#" + tabNames[activeTabIndex] + "_tab").fadeIn();
                $("#" + tabNames[activeTabIndex]).addClass("active");
                return false;
            });
        });

        var end = Date.now();
        console.log("Building the tabs ended: " + ((end - start) / 1000) );

        $('#rmc_btn_clear').onclick = self.clearAll;
        self.refreshCiteList(self.citationsMap);
    });
}

CitationsViewer.prototype.refreshCiteList = function (citationsMap) {
    var self = this;
    self.citationsMap.getCitationMap().keys().forEach(function (version) {
        var id = "citationTable_" + version;
        var curTab = document.getElementById(version.toLowerCase() + "_tab");
        if (document.getElementById(id)) {
            curTab.removeChild(document.getElementById(id));
        }
        var citationTable = self.generateCiteTable(self.citationsMap.getCitationMap().get(version));
        citationTable.id = id;
        curTab.appendChild(citationTable);
    });
}


CitationsViewer.prototype.getCitationMap = function () {
    self.citationsMap.getCitationMap();
}

CitationsViewer.prototype.clearAll = function () {
    self.citationsMap.clearAll();
}

CitationsViewer.prototype.addCitations = function (articleKey, citePage) {
    var self = this;
    var arr = Array.prototype.slice.call(citePage.getElementsByTagName("tr"))
    arr.map(function (tr) {
        var key = tr.getElementsByClassName("gs_citf")[0].innerText;
        var value = tr.getElementsByClassName("gs_citr")[0].innerText;
        self.citationsMap.addCitation(key,articleKey,value);
    });
}

/**
 * Given a list of citations, formulates them into a sorted html div,
 * and returns the div
 * @param versionList
 * @returns {HTMLElement}
 */
CitationsViewer.prototype.generateCiteTable = function (versionList) {
    var citationsTable = document.createElement('table');
    citationsTable.className = "citationsTable";

    versionList.values().sort().forEach(function (value) {
        var tr = document.createElement('tr');
        var curCite = document.createElement('td');
        curCite.appendChild(document.createTextNode(value))
        tr.appendChild(curCite);
        citationsTable.appendChild(tr);
    });

    return citationsTable;
}