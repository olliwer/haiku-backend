var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');

var app = express();

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

function acceptsJson(req){
	return req.accepted.some(function(type) {return type.value === 'application/json';});
}

app.get('/', function(req, res) {
	if (acceptsJson(req)) {
		res.json({message: 'Greetings, traveler! Try /instructions.'});
	} else {
		res.send(406);
	}
});

app.get('/instructions', function(req, res) {
	if (acceptsJson(req)) {
		res.json({message: 'Follow the secret path.'});
    } else {
    	res.send(406);
    }
});

app.get('/secret', function(req, res) {
	if (acceptsJson(req)) {
		res.json({message: 'Open the button in a web browser.'});
	} else {
		res.send(406);
	}
})

app.get('/button', function(req, res) {
	res.render('button.html');
});
 
app.get('/message', function(req, res) {
	if (acceptsJson(req)) {
		res.set({'Hint': 'Joan Daemen probably was a good guy.'});
		res.json([{key:'wappu15'}, {message:'om2dSfSrjIroKguSVmZO6oWbIXwSab6huhVqlzKn9dA3IMa1GitYKrAioUMXrcfi'}]);
	} else {
		res.send(406);
	}
});

app.get('/challenge', function(req, res) {
	if (acceptsJson(req)) {
		res.send('Create a web application that persists the following JSON as a POST request. Further ' + 
			'instructions follow. \n' + 
			JSON.stringify({"message": "string"}, null, 4) + '\n' + 
			'POST your applications URL and your contact information to the following path: /challenge in the following JSON format: \n' +
			JSON.stringify({"url": "string", "name": "string", "e-mail": "string"}, null, 4));
	} else {
		res.send(406);
	}
});


app.post('/challenge', function(req, res) {
	if (!req.is('json')){
		res.send(415);
	}
	var url = req.body.url;
	var name = req.body.name;
	var email = req.body.email;
	if (url && name && email){
		pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('INSERT INTO PARTICIPANT(path, email, name) VALUES (?, ?, ?)' [url, name, email], function(err, result){
			done();
			if (err) { 
				console.error(err); 
				res.json({message: "Caught an error. Please check your query and try again."}); 
			} else { 
				res.json({message: "Godspeed. We'll stay in touch."});
			}
		});
	});
	} else {
		res.json({message: "Please provide all values."});
	}

});

app.listen(process.env.PORT || 3000);
console.log('Started.');
