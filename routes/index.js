var express = require('express'),
    article = require('../libs/article'),
    router = express.Router()

function pathToLinks(path) {
  var links = [];
  if (path == "/") {
    return links;
  }
  var cpath = "",
      name,
      component,
      pathcs = path.split('/');

  for (var i in pathcs) {
    component = pathcs[i]
    if (cpath == "/") {
        cpath = cpath + component 
    } else {
        cpath = cpath + "/" + component 
    }
    if (cpath == "/") {
        name = "Home"
    } else {
        name = decodeURIComponent(component)
    }
    links.push({name: name, path: cpath})    
  }
  return links
}

router.get('/*', function(req, res, next) {
  var path = req.path
  var art = new article(router.datadir, path)
  if (/.+\/$/.test(path)) {
    res.redirect(path.substr(0, path.length - 1))
  }
  var links = pathToLinks(path)
  var title = decodeURIComponent(path) + ' - MarkWiki'
  var c
  var view
  if (req.query.m == 'edit') {
    c = art.getAsText();
    view = 'edit'
  } else {
    c = art.getAsHTML()
    view = 'index'
  }

  res.render(view , {
                      title: title,
                      path: path,
                      contents: c,
                      links: links
                      });
});

router.post('/*', function(req, res, next) {
  var path = req.path
  var art = new article(router.datadir, path)
  art.save(req.body.contents)
  res.redirect(path)
});

module.exports = router;
