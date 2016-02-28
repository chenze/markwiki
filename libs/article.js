var md5 = require('md5'),
    marked = require('marked'),
    fs = require('fs');

var article = function(root, path) {
    this.root = root
    this.path = path
}
article.prototype.getFullPath = function() {
    return this.root + '/' + md5(this.path)
};
article.prototype.getAsText = function() {
    var path = this.getFullPath()
    try {
        return fs.readFileSync(path).toString('UTF8');
    } catch (e) {
        return ''
    }
};
article.prototype.getAsHTML = function() {
    return marked(this.getAsText());
};
article.prototype.save = function(contents) {
    var path = this.getFullPath()
    return fs.writeFileSync(path, contents);
};

module.exports = article
