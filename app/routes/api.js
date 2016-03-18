var User = require('../models/user');
var Story = require('../models/story');

var config = require('../../config/config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

function createToken(user){

  var token = jsonwebtoken.sign({
    id: user._id,
    name: user.name,
    username: user.username
  }, secretKey, {
    expirtesInMinute: 1440
  });

  return token;
}

  module.exports = function (app, express) {

    var pathName = __dirname.split('app')[0]+'davfsroot';
    var api = express.Router();

    api.post('/signup', function (req, res) {

      var user = new User({
        name: req.body.name,
        lastname:req.body.lastname,
        username: req.body.username,
        password: req.body.password
      });

      user.save(function (err) {
        if(err){
          res.send(err);
          return;
        }

        res.json({
          message: 'User has been created!',
          success:true
        });
      });
    });

    api.get('/users', function (req, res) {

      User.find({}, function (err, users) {
        if(err){
          res.send(err);
          return;
        }

        res.json(users);
      });
    });

    api.post('/login', function (req, res) {

      User.findOne({
        username:req.body.username
      }).select('password').exec(function (err, user) {

        if(err) throw err;
        if(!user){
          res.send({message: "User doesn't exist"});
        } else if(user){

          var validPassword = user.comparePassword(req.body.password);

          if(!validPassword){
            res.send({message: "Invalid Password"});
          }else{

            var token = createToken(user);

            res.send({
              success: true,
              message: "Successfully login!",
              token: token
            })
          }
        }
      })
    });

    api.use(function (req, res, next) {
      console.log("Somebody just came to our app!!!");

      var token = req.body.token || req.param('token') || req.headers['x-access-token'];

      //check if token exist
      if(token){

        jsonwebtoken.verify(token, secretKey, function (err, decoded) {
          if(err){
            res.status(403).send({
              success:false,
              message:"Faild to authentificate user"
            });
          } else {

            req.decoded = decoded;
            next();
          }
        });

      } else {
        res.status(403).send({
          success: false,
          message: "No token provided"
        })
      }
    });



    api.route('/')
      .post(function (req, res) {

        var story = new Story({

          creator: req.decoded.id,
          content: req.body.content
        });

        story.save(function (err) {
          if(err){
            res.send(err);
            return;
          }

          res.json({message: "New story created!!"});
        });
      })

      .get(function (req, res) {

        Story.find({creator: req.decoded.id}, function (err, stories) {
          if(err){
            res.send(err);
            return;
          }
          res.json(stories);
        })
      });

    api.get('/me', function (req, res) {
      res.json(req.decoded);
    });

    api.get('/filesystem', function (req,res) {
      var requsetData = req.headers['0']?'/'+req.headers['0']:'/';

      var walk = function(dir, done) {
        var results = [];
        var dirs = [];
        fs.readdir(dir, function (err, list) {
          if (err) return done(err);
          var pending = list.length;
          if (!pending) return done(null, results);
          list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
              if (stat && stat.isDirectory()) {
                dirs.push(file);
                if (!--pending) done(null, results, dirs);
              } else {
                results.push(file);
                if (!--pending) done(null, results, dirs);
              }
            });
          });
        });
      };

      walk(pathName + requsetData, function (err, results, dirs) {
        if (err) throw err;
        res.send({files:results, dirs:dirs});
      });
    });

    api.get('/folderTree', function (req,res) {
      var requsetData = req.headers['0']?'/'+req.headers['0']:'/';

      function getDirectories(srcpath) {
        return fs.readdirSync(srcpath).filter(function(file) {
          return fs.statSync(path.join(srcpath, file)).isDirectory();
        });
      }

      res.send(getDirectories(pathName+requsetData));
    });

    return api;

  };


