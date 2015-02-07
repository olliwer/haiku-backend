var express = require('express');
var pg = require('pg');
 
var app = express();

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

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
	res.send('Open the button in a web browser.');
})

app.get('/button', function(req, res) {
	res.render('button.html');
});
 
app.get('/message', function(req, res) {
	if (acceptsJson(req)) {
		res.json([{key:'wappu15'}, {message:'YMvASzfz3II4WtuMlrOUQkQ2C2XLxcODRcMhG/T117+VAu42v04/' +
		'5fGqYBz2+ytSNyDGtRorWCqwIqFDF63H4g=='}]);
	}
});

app.get('/challenge', function(req, res) {
	if (acceptsJson(req)) {
		res.send('Create a web application that persists the following JSON as a POST request. Further ' + 
			'instructions follow. PUT your applications URL to the following path: /challenge/path-to-project. \n' + 
			JSON.stringify({"message": "string"}, null, 4));
	}
});

app.put('/challenge/:path', function(req, res) {
	var path = req.params.path;	
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('INSERT INTO PARTICIPANT(path) VALUES (\'' + path + '\')', function(err, result){
			done();
			if (err) { 
				console.error(err); 
				res.send("Error " + err); 
			} else { 
				res.send("Godspeed. We'll stay in touch.");
			}
		});
	});

});

app.listen(process.env.PORT || 3000);
console.log('Started.');
