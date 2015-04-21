var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var http = require('http');
var when = require('when');
var url_parser = require('url');

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
		res.set({'Hint': 'What would Crockford do?'});
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
		res.send('Create a web application that will receive a POST request containing two variables in the request body. '
			+ 'Your application has to be publicly available and it will be tested on submission. Your application recieve a POST request with the body: \n' + 
			JSON.stringify({"number1": 1, "number2": 2}, null, 4) + '\n' + 
			'Your server must answer with the addition of the two numbers. The answers body should look like: \n' +
			JSON.stringify({"result": 3}, null, 4) + '\n' +
			'After you have the server running, POST your applications URL and your contact information to the following path: /challenge in the following JSON format: \n' +
			JSON.stringify({"url": "string", "name": "string", "e-mail": "string"}, null, 4));
	} else {
		res.send(406);
	}
});

function isEmpty(value) {
	return !value || value.trim() == '';
}

function validateWebServer(url) {
	var def = when.defer();

	var number1 = Math.floor((Math.random() * 100) + 1);
	var number2 = Math.floor((Math.random() * 100) + 1);
	var parser = url_parser.parse(url);

	var data = {
		number1: number1,
		number2: number2
	};

	var dataString = JSON.stringify(data);

	var headers = {
		'Content-Type': 'application/json'
	};

	var options = {
		host: parser.hostname,
		port: parser.port,
		path: parser.pathname,
		method: 'POST',
		headers: headers
	};

	var request = http.request(options, function (response) {
		response.setEncoding('utf-8');

		var responseString = '';

		response.on('data', function(data) {
			responseString += data;
		});

		response.on('end', function() {
			try {
				resultData = JSON.parse(responseString);
				if (resultData.result === (number1 + number2)) {
					return def.resolve(true);
				} else {
					return def.resolve(false);
				}
			} catch (err) {
				def.resolve(false);
			}
		});
	});

	request.on('error', function(err) {
		def.resolve(false);
	});

	request.write(dataString);
	request.end();

	return def.promise;
}

app.post('/challenge', function(req, res) {
	if (!req.is('json')){
		res.send(415);
	}
	var url = req.body.url;
	var name = req.body.name;
	var email = req.body.email;
	if (!isEmpty(url) && !isEmpty(name) && !isEmpty(email)) {
			validateWebServer(url)
			.done(function(validation) {
				if (!validation) {
					res.json({message: "Your server didn't return the correct value"})
				} else {
					pg.connect(process.env.DATABASE_URL, function(err, client, done) {
						client.query('INSERT INTO PARTICIPANT(path, email, name) VALUES ($1, $2, $3)', [url, name, email], function(err, result){
							done();
							if (err) {
								console.error(err);
								res.json({message: "Caught an error. Please check your query and try again."});
							} else {
								res.json({message: "Godspeed. We'll stay in touch."});
							}
						});
					});
				}
			});
		} else {
			res.json({message: "Parameters missing"});
		}
});

app.listen(process.env.PORT || 3000);
console.log('Started.');
