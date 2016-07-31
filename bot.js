var net = require('net');
var natural = require('natural');
 
var sockets = [];

var reply = function(msg, socket) {
    socket.write('>> ' + msg + '\n');
    console.log(msg);
}

var process = function(msg) {
    var memory = {
        'hi': 'Hi There !',
        'how are you': 'Great !, How are You doing ?',
        'fine': 'Nice :) !',
        'bad': 'Oh !, You can tell more if it is OK ..',
        'no': 'That\'s OK ..',
    };
    
    var leastDistance = null;
    var mostlyThis = null;
    
    for(x in memory) {
        var measuring =  natural.LevenshteinDistance(msg, x, {
            insertion_cost: 1,
            deletion_cost: 1,
            substitution_cost: 1
        });
        
        if(leastDistance == null || measuring < leastDistance)
        {
            leastDistance = measuring;
            mostlyThis = x;
        }
        
        console.log("For: " + x + " = " + measuring);
    }
    
    if(mostlyThis != null)
        return memory[mostlyThis];
    else    
        return "Sorry, Couldn't understand You !";
}
 
var server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
	socket.write('>> Welcome to the Telnet server!\n>> You can talk to me freely.\n>> Simply, You can say "Bye" at anytime to end this chat !\n\n');
	sockets.push(socket);
	
	socket.on('data', function(data) {
	    data = data.replace(/(\r\n|\n|\r)/gm,"").toLowerCase();
		console.log(">> " + data);
		switch(data) {
		    case 'bye':
		        socket.end(process(data) + "\n");    
	        break;
		    
		    default:
		        reply(process(data), socket);
		}
		
	})
	
	socket.on('end', function() {
		var i = sockets.indexOf(socket);
    	if (i != -1) {
    		sockets.splice(i, 1);
    	}
    })
}).listen(8888);

