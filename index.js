var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080;

var server = express();

server.post(
	'/ytsearch', 
	bodyParser.json(),
	ytServer
);

function ytServer(req, res){
	var body = req.body;	

	if (body) {
		console.log('Incoming body', body);
		console.log('Command', body.command, body.text);
		response = {text: 'Echo back:' + body.text};

		res.json(response).end();
	} else {
		console.error('Error parsing body');
		res.status(500).end();
	}
}

server.listen(PORT);
console.log('Started server on', PORT);

