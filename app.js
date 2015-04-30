var express = require("express");

var app = express();

var body_parser = require("body-parser");
app.use(body_parser.urlencoded());

app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(request, response){
	response.render("welcome");
});

var server = app.listen(8000, function(){
	console.log("Server running at port 8000 ...");
});

var io = require("socket.io").listen(server);
var chats = [];

io.sockets.on('connection', function(socket){
	console.log('Using sockets now');

	var current_user;

	socket.on("user_add", function(data){
		console.log("User added " + data);
		current_user = data;
		socket.emit("chat_refresh", chats);
	});

	socket.on("chat_send", function(data){
		console.log(data);
		var new_chat = [current_user, data];
		chats.push(new_chat);
		io.emit("chat_refresh", chats);
	});


});