var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var path = require('path');
var fs = require('fs');
var jsDAV = require("jsDAV/lib/jsdav");
var jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs");
var jsDAV_Server = require("jsDAV/lib/DAV/server");




module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  var nodePath = path.join(__dirname.replace('config', ''), config.webdav.rootDir);
  var locksPath = path.join(__dirname.replace('config', ''), config.webdav.locksDir);
  if (!fs.existsSync(nodePath)) {
    fs.mkdirSync(nodePath);
  }
  if (!fs.existsSync(locksPath)) {
    fs.mkdirSync(locksPath);
  }

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');
  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());

  jsDAV.debugMode = true;

  app.use(function (req, res, next) {

      if (req.url.search(/^\/webdav/) >= 0) {

        if (jsDAV.debugMode) {
          console.log('WebDav: Starting server, version: %s', jsDAV_Server.VERSION);
        }

        console.log('-----------');
        jsDAV.mount({
            node: nodePath,
            locksBackend:jsDAV_Locks_Backend_FS.new(locksPath),
            mount: "/webdav",
            server: req.app,
            standalone: false
          }
        ).exec(req, res);
      }
      else {
        next();
      }
    }
  );

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());



  var api = require('../app/routes/api')(app, express);
  app.use('/api', api);

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });



  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};