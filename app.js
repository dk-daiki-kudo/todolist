var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var helmet = require('helmet');

var app = express();
var contents;

app.use(express.static('views'));
app.use(bodyParser.json());
app.use(helmet());

app.set('view engine', 'html');

//3000番ポートで待つ
var port = process.env.PORT || 3000;
app.listen(port);

//connection to database and get database object
mongodb.MongoClient.connect("mongodb://heroku_d7sb4n2m:3rjg7an14o6kda7dm6d3nr07h1@ds145649.mlab.com:45649/heroku_d7sb4n2m", function(err, database) {
  contents = database.collection("contents");
});

// get contents
app.get("/api/contents", function(req, res) {
  contents.find().toArray(function(err, items) {
    res.send(items);
  });
});

// get content
app.get("/api/contents/:_id", function(req, res) {
  contents.findOne({_id: mongodb.ObjectID(req.params._id)}, function(err, item) {
    res.send(item);
  });
});

// saveはキーの有無で挙動が変わる
app.post("/api/contents", function(req, res) {
  var content = req.body;
  if (content._id) content._id = mongodb.ObjectID(content._id);
  contents.save(content, function() {
    res.send("insert or update");
  });
});

// 削除
app.delete("/api/contents/:_id", function(req, res) {
  contents.remove({_id: mongodb.ObjectID(req.params._id)}, function() {
    res.send("delete");
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});