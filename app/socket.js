/**
 * Created by 양인호꺼 on 2017-02-19.
 */
var socket = require('socket.io');


module.exports = function(server) {
    var io = socket(server);
    var count=1;
    io.on('connection', function(socket){
        console.log('user connected: ', socket.id);
        var name = "user" + count++;
        io.to(socket.id).emit('change name',name);

        socket.on('disconnect', function(){
            console.log('user disconnected: ', socket.id);
        });

        socket.on('send message', function(name,text){
            var msg = name + ' : ' + text;
            console.log(msg);
            io.emit('receive message', msg);
        });
    });

}


