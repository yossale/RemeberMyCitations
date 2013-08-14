function CitationsRepository() {
    this.versions = ["APA", "MLA", "Chicago"];
    this.self = this;
}

CitationsRepository.prototype.getCitationMap = function () {
    var map = new Hashtable();
    this.versions.map(function (version) {
        var hash = new Hashtable();
        var str = localStorage.getItem(version);
        hash.fromJsonString(str);
        map.put(version, hash);
    });
    return map;
}

CitationsRepository.prototype.addCitation = function (version, articleId, cite) {
    var citationArr = localStorage.getItem(version)
    var hash = new Hashtable();
    hash.fromJsonString(citationArr);
    hash.put(articleId, cite);
    localStorage.setItem(version, hash.toJsonString());
}

CitationsRepository.prototype.removeCitation = function (articleId) {
    this.versions.map(function (version) {
        var jsonStr = localStorage.getItem(version);
        jsonStr = jsonStr ? jsonStr : "[]";
        var hash = new Hashtable();
        hash.fromJsonString(jsonStr);
        hash.removeEntryForKey(articleId);
        localStorage.setItem(version, hash.toJsonString());
    });
}

CitationsRepository.prototype.clearAll = function () {
    this.versions.map(function (version) {
        var hash = new Hashtable();
        localStorage.setItem(version, hash.toJsonString());
    });
}

Hashtable.prototype.fromJsonString = function (str) {
    var self = this;
    var arr = str ? JSON.parse(str) : JSON.parse("[]");
    if (arr) {
        arr.map(function (a) {
            self.put(a[0], a[1]);
        });
    }
}

Hashtable.prototype.toJsonString = function () {
    return JSON.stringify(this.entries());
}
