const socket = require('socket.io');
let MongoClient = require('mongodb').MongoClient;

function addObject(collection, object) {
    collection.insert(object, function (err,result) {
        if(!err) {
            console.log("add document successfully!!");
        }
        else {
            console.log(err);
        }
    });
}


module.exports = function(server) {
    let io = socket(server);

    io.on('connection', function (socket) {
        socket.on('personal info', function (msg) {
            MongoClient.connect("mongodb://localhost/",function (err, db) {
                var myDB = db.db("AM");
                myDB.collection("USERS_COL", function (err, USERS_COL) {
                    addObject(USERS_COL,msg);
                })
            });
        });
    });
}
