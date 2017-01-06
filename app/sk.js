module.exports = function(socket, io) {
    socket.on('disconnect', function(){
        console.log('User disconnected');
    });

    socket.on('mqtt_connect', function(p){
        console.log('mqtt_connect');
        socket.emit('mqtt_connected', {msg:'mqtt_connected, data from server'});
    });

    socket.on('mqtt_disconnect', function(p){
        console.log('mqtt_disconnect');
        socket.emit('mqtt_disconnected', {msg:'mqtt_disconnected, data from server'});
    });
};