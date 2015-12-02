var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var rp = require('request-promise');
var util = require('util');

var PORT = process.env.PORT || 8080;
var YT_VID_URL = "https://youtube.com/watch?v=";
var YT_KEY = process.env.YT_KEY;
// https://www.googleapis.com/youtube/v3/search?q=kids+hall&part=snippet&key=AIzaSyAD96gsoqxg9sx142kQrFqFe9dXGbalFN4
var YT_URL_TEMPLATE = 'https://www.googleapis.com/youtube/v3/search?q=%s&part=snippet&type=video&key=%s';

if (!YT_KEY) {
	console.error('No YT API key provided');
	process.exit(1);
}

var server = express();

server.post(
	'/ytsearch', 
	bodyParser.urlencoded(),
	ytServer
);

function ytServer(req, res){
	var body = req.body;	

	if (body) {
		console.info('User', body.user_name, 'searched for', body.text);

		return searchYt(body.text)
			.then(function(results) {
				var responseText;
				var response;
				var videoId;

				if (!results.items.length) {
					responseText = "Weird, I couldn't find any videos :(";

				} else {
					videoId = results.items[0].id.videoId;
					if (!videoId) {
						console.error('No video ID found', results.items[0]);
					}
					responseText = YT_VID_URL + videoId;
				}
				response = {
					text: responseText,
					response_type: 'in_channel'
				};
				return res.json(response).end();
			})
			.catch(function(e) {
				console.error('Failed to obtain results for', body.text, e);
				res.status(500).end();
			});

	} else {
		console.error('Error parsing body');
		res.status(500).end();
	}
}

function searchYt(term) {
	var url = util.format(YT_URL_TEMPLATE, term, YT_KEY);
	return rp(url)
		.then(function(res) {
			var results = JSON.parse(res);
			return results;
		});
}

server.listen(PORT);
console.log('Started server on', PORT);

