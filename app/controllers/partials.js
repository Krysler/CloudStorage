var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

module.exports = function (app) {
  app.use('/partials/:name', function(req,res){
  var name = req.params.name;
  res.render('partials/' + name);
  });
};
