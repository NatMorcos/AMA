/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , Models = require('./models')
  , controller = require('./controller');


/**
 * Initialize database connection.
 */
var models = new Models(init);

function init(){
  var app = express();

  app.configure(function(){
    app.set('port', process.env.PORT || 8080);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  /**
   * Serve the application index
   */
  app.get('/', function(req, res){
    res.sendfile(path.join(__dirname, 'public', 'index.html'));
  });

  /**
   * Routes for Topic REST API
   */
  app.get('/topic', controller.list);
  app.post('/topic', controller.new);
  app.get('/topic/:tid', controller.get);
  app.post('/topic/:tid/upvote', controller.upvote);
  app.post('/topic/:tid/reply', controller.reply);
  app.post('/topic/:tid/reply/:rid', controller.reply);
  app.post('/topic/:tid/reply/:rid/upvote', controller.upvote);
  app.get('/clear', controller.clear);

  /* Inject Models */
  controller.setModels(models);

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
}