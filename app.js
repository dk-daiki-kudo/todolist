var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var app = express();
var contents;

app.use(express.static('views'));
app.use(bodyParser.json());

//3000番ポートで待つ
app.listen(3000);

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
