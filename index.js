var http = require('http');
var PORT = process.env.PORT || 8080;

function ytServer(req, res){
	var reqBody = '';

	function appendBody(data){
		reqBody += data;
	}

	if (req.url.indexOf('/ytsearch') === 0) {
		req.on('data', appendBody);
		req.on('end', function() {
			var body = parseBody(reqBody);	

			if (body) {
				console.log('Incoming body', body);
				console.log('Command', body.command, body.text);
				res.status(200).end();
			} else {
				console.error('Error parsing body');
				res.status(500).end();
			}
		});
	}
}

function parseBody(body) {
	var parsedBody;

	try {
		parsedBody = JSON.parse(body);
	} catch (e) {
	}

	return parsedBody;
}

http.createServer(ytServer).listen(PORT);
console.log('Started server on', PORT);

