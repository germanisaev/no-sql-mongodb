// init project
const express = require("express"); // the library we will use to handle requests
const mongodb = require("mongodb").MongoClient; // load mongodb

const port = 4567; // port to listen on

const app = express(); // instantiate express
app.use(require("cors")()); // allow Cross-domain requests
app.use(require("body-parser").json()); // automatically parses request data to JSON

// make sure in the free tier of MongoDB atlas when connecting, to
// select version 2.2.* as the node.js driver instead of the default 3.0
// put your URI HERE ?
// const uri = "mongodb+srv://<username>:<password>@<url>:<port>/<database>"; // put your URI HERE

const uri = "mongodb://localhost:27017/itproger"

// connect to your MongoDB database through your URI. 
// The connect() function takes a uri and callback function as arguments.
mongodb.connect(uri, (err, db) => {

    if (err) throw err;
    console.log("Database connected!");
    // connect to your specific collection (a.k.a database) that you specified at the end of your URI (/database)
    const collection = db.collection("users");

    // Responds to GET requests with the route parameter being the username.
    // Returns with the JSON data about the user (if there is a user with that username)
    // Example request: https://mynodeserver.com/myusername
    app.get("/:user", (req, res) => {
        // search the database (collection) for all users with the `user` field being the `user` route paramter
        collection.find({ user: req.params.user }).toArray((err, docs) => {
            if (err) {
                // if an error happens
                res.send("Error in GET req.");
            } else {
                // if all works
                res.send(docs); // send back all users found with the matching username
            }
        });
    });

    // Responds to POST requests with the route parameter being the username.
    // Creates a new user in the collection with the `user` parameter and the JSON sent with the req in the `body` property
    // Example request: https://mynodeserver.com/myNEWusername
    app.post("/:user", (req, res) => {
        // inserts a new document in the database (collection)
        collection.insertOne(
            { name: req.body, user: req.params.user }, // this is one object to insert. `requst.params` gets the url req parameters
            (err, r) => {
                if (err) {
                    res.send("Error in POST req.");
                } else {
                    res.send("Information inserted");
                    db.close();
                }
            }
        );
});

// this doesn't create a new user but rather updates an existing one by the user name
// a request looks like this: `https://nodeserver.com/username23` plus the associated JSON data sent in
// the `body` property of the PUT request
app.put("/:user", (req, res) => {
    collection.find({ user: req.params.user }).toArray((err, docs) => {
        if (err) {
            // if and error occurs in finding a user to update
            res.send("Error in PUT req.");
        } else {
            collection.updateOne(
                { user: req.params.user }, // if the username is the same, update the user
                { $set: { name: req.body, user: req.params.user } }, // update user data
                (err, r) => {
                    if (err) {
                        // if error occurs in actually updating the data in the database
                        console.log("Error in updating database information");
                    } else {
                        // everything works! (hopefully)
                        res.send("Updated successfully");
                    }
                }
            );
}
});

// if someone goes to base route, send back they are home.
app.get("/", (req, res) => {
    res.send("You are home ??.");
});
});

// listen for requests
var listener = app.listen(port, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
});
/*
// Retrieve
var MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017'
// Connect to the db
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {

    if (err) {
        console.error(err)
        return
    }

    const db = client.db('itproger')

    const collection = db.collection('users')

    collection.insertOne({ name: 'Roger', age: 33, email: 'roger@gmail.com', password: 'Aa123456', birthday: new Date('1982-09-17') }, (err, result) => {
        console.log(result)
    })

    collection.insertMany([
        { name: 'Togo', age: 37, email: 'togo@gmail.com', password: 'Aa123456', birthday: new Date('1987-10-27') },
        { name: 'Syd', age: 39, email: 'syd@gmail.com', password: 'Aa123456', birthday: new Date('1990-05-10') }], (err, result) => {
        console.log(result)
    })

    collection.find().toArray((err, items) => {
        console.log(items)
    })

    collection.find({ name: 'Togo' }).toArray((err, items) => {
        console.log(items)
    })

    collection.updateOne({ name: 'Togo' }, { '$set': { 'name': 'Togo2' } }, (err, item) => {
        console.log(item)
    })

    collection.deleteOne({ name: 'Togo' }, (err, item) => {
        console.log(item)
    })

    // Use promises or async/await
    collection.findOne({ name: 'Togo' }, (err, item) => {
        console.log(item)
    })

    collection.findOne({ name: 'Togo' })
        .then(item => {
            console.log(item)
        })
        .catch(err => {
            console.error(err)
        })

    const find = async () => {
        try {
            const item = await collection.findOne({ name: 'Togo' })
        } catch (er) {
            console.error(err)
        }
    }

    find()

    client.close()
})
*/
/*
MongoClient.connect("mongodb://localhost:27017/itproger", function (err, db) {
    if (err) { return console.dir(err); }

    db.collection('users', function (err, collection) {

        collection.insert({ firstName: 'Steve', lastName: 'Jobs', age: 33, email: 'steve.jobs@gmail.com', password: 'Aa123456', birthday: new Date('1982-09-23') });
        collection.insert({ firstName: 'Bill', lastName: 'Gates', age: 41, email: 'bill.gates@gmail.com', password: 'Aa123456', birthday: new Date('1991-10-20') });
        collection.insert({ firstName: 'James', lastName: 'Bond', age: 37, email: 'james.bond@gmail.com', password: 'Aa123456', birthday: new Date('1995-04-27') });

        db.collection('users').count(function (err, count) {
            if (err) throw err;

            console.log('Total Rows: ' + count);
        });

        collection.update({ id: 1 }, { $set: { firstName: 'James', lastName: 'Gosling' } }, { w: 1 },
            function (err, result) {
                if (err) throw err;
                console.log('Document Updated Successfully');
            });

        collection.remove({ id: 2 }, { w: 1 }, function (err, result) {

            if (err) throw err;

            console.log('Document Removed Successfully');
        });

        collection.find().toArray(function(err, items) {
            if(err) throw err;
            console.log(items);
        });

    });

});
*/