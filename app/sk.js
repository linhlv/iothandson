module.exports = function(socket, io) {
    var mqtt = require('mqtt');
    var Connection  = require('./models/connection');
	var Publication  = require('./models/publication');

    socket.on('disconnect', function(){});

    socket.on('mqtt_publish', function(p){   
        if(!p) {
            socket.emit('mqtt_published', {success:false, message: 'Error!'});
        }else{            
            //validate with current account   
            Publication.findById(p.id, function(err, item) {
                if (err){
                    socket.emit('mqtt_published', {success:false, message:err});
                    return;    
                }

                Connection.findById(item.connectionId, function(err, connection) {
                    if (err){
                        socket.emit('mqtt_published', {success:false, message:err});
                        return;    
                    }

                    var client  = mqtt.connect('mqtt://' + connection.server, {
                        port: connection.port, 
                        clientId: connection.clientId,
                        username: connection.username,
                        password: connection.password,
                    });
                    
                    client.on('connect', function () {                       
                        client.publish(item.topic, p.value);
                        socket.emit('mqtt_published', {success:true});
                    });
                });	 
            });	         
                       
        }        
    });
};