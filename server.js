var express = require('express');
 
var app = express();

app.get('/', function(req, res) {
	if (req.accepted.some(function(type) {return type.value === 'application/json';})) {
    	res.send('Greetings, traveler! Try /instructions.');
	} else {
		res.send('Try JSON.');
	}
});
 
app.get('/secret', function(req, res) {
    res.json([{key:'wappu15'}, {message:'YMvASzfz3II4WtuMlrOUQkQ2C2XLxcODRcMhG/T117+VAu42v04/' +
    	'5fGqYBz2+ytSNyDGtRorWCqwIqFDF63H4g=='}]);
});

app.get('/instructions', function(req, res) {
    res.send('Follow the secret path.');
});

app.get('/challenge', function(req, res) {
	res.json([{message: 'Create a web application that takes in the following JSON as a POST ' +
		'request. Further instructions follow. E-mail the URL to <e-mail>.', 
		json: {"content": {"message":"string","asd":"string","f":"string"}}}]);
});

app.listen(process.env.PORT || 3000);
console.log('Started.');
