var express = require('express');
 
var app = express();

function acceptsJson(req){
	return req.accepted.some(function(type) {return type.value === 'application/json';});
}

app.get('/', function(req, res) {
	if (acceptsJson(req)) {
    	res.send('Greetings, traveler! Try /instructions.');
	} else {
		res.send('Try JSON.');
	}
});

app.get('/instructions', function(req, res) {
	if (acceptsJson(req)) {
    	res.send('Follow the secret path.');
    }
});
 
app.get('/secret', function(req, res) {
	if (acceptsJson(req)) {
    	res.json([{key:'wappu15'}, {message:'YMvASzfz3II4WtuMlrOUQkQ2C2XLxcODRcMhG/T117+VAu42v04/' +
    		'5fGqYBz2+ytSNyDGtRorWCqwIqFDF63H4g=='}]);
    }
});

app.get('/challenge', function(req, res) {
	if (acceptsJson(req)) {
		res.send('Create a web application that takes in the following JSON as a POST ' +
			'request. Further instructions follow. Send the path to the following path: /challenge/path-to-project \n' + 
			JSON.stringify({"content": {"message":"string","field1":"string","field2":"string"}}, null, 4));
	}
});

app.get('/challenge/:path', function(req, res) {
	var path = req.params.path;

});

app.listen(process.env.PORT || 3000);
console.log('Started.');
