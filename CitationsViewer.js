function CitationsViewer() {
    this.bobo = this;
    this.versions = ["APA", "MLA", "Chicago"];
    var start = Date.now();
    this.citationsRepository = new CitationsRepository();
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
            self.refreshCiteList();
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

    $.get(chrome.extension.getURL("citations.html"), function (data) {
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
        console.log("Building the tabs ended: " + ((end - start) / 1000));

        document.getElementById("rmc_btn_clear").onclick = function () {
            console.log("Trying to clear all..");
            self.clearAll()
        }

        self.refreshCiteList();
    });
}

CitationsViewer.prototype.refreshCiteList = function () {
    var self = this;
    self.citationsRepository.getCitationMap().keys().forEach(function (version) {
        var id = "citationTable_" + version;
        var curTab = document.getElementById(version.toLowerCase() + "_tab");
        if (document.getElementById(id)) {
            curTab.removeChild(document.getElementById(id));
        }
        var citationTable = self.generateCiteTable(self.citationsRepository.getCitationMap().get(version));
        citationTable.id = id;
        curTab.appendChild(citationTable);
    });
}


CitationsViewer.prototype.getCitationMap = function () {
    var self = this;
    self.citationsRepository.getCitationMap();
}

CitationsViewer.prototype.clearAll = function () {
    var self = this;
    self.citationsRepository.clearAll();
    self.refreshCiteList();
}

CitationsViewer.prototype.addCitations = function (articleKey, citePage) {
    var self = this;
    var arr = Array.prototype.slice.call(citePage.getElementsByTagName("tr"))
    arr.map(function (tr) {
        var key = tr.getElementsByClassName("gs_citf")[0].innerText;
        var value = tr.getElementsByClassName("gs_citr")[0].innerText;
        self.citationsRepository.addCitation(key, articleKey, value);
    });
}

/**
 * Given a list of citations, formulates them into a sorted html div,
 * and returns the div
 * @param versionList
 * @returns {HTMLElement}
 */
CitationsViewer.prototype.generateCiteTable = function (versionList) {
    var self = this;
    var citationsTable = document.createElement('table');
    citationsTable.className = "citationsTable";

    versionList.entries().sort(function (a, b) {
        a[1] < b[1] ? 0 : 1
    }).forEach(function (arr, index) {

        var key = arr[0];
        var value = arr[1];

        var tr = document.createElement('tr');
        var curCite = document.createElement('td');
        curCite.appendChild(document.createTextNode(value));
        tr.appendChild(curCite);
        tr.appendChild(document.createElement("td").appendChild(self.generateRemoveButton(key, index)))
        citationsTable.appendChild(tr);
    });

    return citationsTable;
}

CitationsViewer.prototype.generateRemoveButton = function (citeKey, index) {

    var self = this;


//    var img = $('<div/>').append("<img id='theImg' src=" + chrome.extension.getURL("images/delete.ico") + "/>");

    var btn = $('<button/>', {
        text: "rmv", //set text 1 to 10
        className: "rmc_rmvBtn",
        icons: { primary: 'ui-icon-trash' },
        id: 'rmc_rmvBtn_' + index,
        click: function() {
            console.log("Calling the remove button function");
            self.citationsRepository.removeCitation(citeKey);
            self.refreshCiteList();
        }
    });
    btn.css('background-image', chrome.extension.getURL("images/delete.ico"));

    return btn[0];

}