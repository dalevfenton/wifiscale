var express = require('express');
var request = require('request');

var cors = require('cors');


var mongo = require('mongodb');
var monk = require('monk');
var db = monk(process.env.MONGODB_URI);

var app = express();
app.use(cors()); //allows overriding cross origin policy (use npm install if needed)
app.use(function(req, res, next){
  req.db = db;
  next();
});

// POST to DB
app.post('/api/addweight', function(req, res){
  var db = req.db;
  console.log(req);
  // var weight = req.body.weight;
  // var time = req.body.timeStamp;
  //
  // var collection = db.get('datapoints');
  //
  // collection.insert({
  //   "weight": weight,
  //   "time": time
  // }, function(err, doc){
  //   if(err){
  //     res.send("Error adding to database");
  //   }else{
  //     res.send(doc);
  //   }
  // });
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
