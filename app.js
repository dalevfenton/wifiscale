var express = require('express');
var request = require('request');

var cors = require('cors');

var mongo = require('mongodb');

var app = express();
app.use(cors()); //allows overriding cross origin policy (use npm install if needed)
var db;
mongo.MongoClient.connect(process.env.MONGODB_URI || test, function(err, database){
  if(err){
    console.log(err);
    throw err;
  }
  db = database;
});
// POST to DB
app.post('/api/addweight', function(req, res){
  var weight = req.query.weight;
  var time = req.query.timeStamp;

  var collection = db.collection('datapoints');

  collection.insert({
    "weight": weight,
    "time": time
  }, function(err, doc){
    if(err){
      res.send("Error adding to database", err);
    }else{
      res.send(doc);
    }
  });
});

app.get('/api/getweight', function(req, res){
  var collection = db.collection('datapoints');
  collection.find({}).toArray(function(e, docs){
    if(e){
      res.send(e);
    }else{
      res.send(docs);
    }
  });
});

var port = process.env.PORT || 3000;
app.listen(port);

console.log('server running on port: ', port);
