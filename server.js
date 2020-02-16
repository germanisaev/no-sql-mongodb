var MongoClient = require('mongodb').MongoClient;
// var format = require('until').format;

MongoClient.connect('mongodb://127.0.0.1:27017', function (err, db) {
    if (err) { throw err; }
    else {
        console.log('Connected');
    }
    db.close();
})