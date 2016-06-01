var express = require('express');
var request = require('request');

var cors = require('cors');

var seedData = [
  {"weight": 100, "time": "12:30:00"},
  {"weight": 75, "time:": "12:40:00"},
  {"weight": 50, "time:": "12:50:00"},
  {"weight": 25, "time:": "01:00:00"}
];
var mongo = require('mongodb');

var app = express();
app.use(cors()); //allows overriding cross origin policy (use npm install if needed)
app.use(function(req, res, next){
  req.db = db;
  next();
});

//test out our DB connection
mongo.mongoClient.connect(process.env.MONGODB_URI, function(err, db){
  if(err) throw err;

  console.log(db);
  var datapoints = db.collection('datapoints');
  datapoints.insert(seedData, function(err, result){
    if(err) throw err;
    console.log(result);
  });
});
// POST to DB
app.post('/api/addweight', function(req, res){
  var db = req.db;
  console.log(req.query);
  var weight = req.query.weight;
  var time = req.query.timeStamp;

  var collection = db.get('datapoints');

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
  var db = req.db;
  var collection = db.get('datapoints');
  collection.find({}, {}, function(e, docs){
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
