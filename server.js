var express = require('express');
 
var app = express();

app.get('/', function(request, response) {
  response.send('Hello Wappu!');
});
 
app.get('/secret', function(req, res) {
    res.send([{key:'wappu15'}, {type:'AES 128'}, {message:'YMvASzfz3II4WtuMlrOUQkQ2C2XLxcODRcMhG/T117+VAu42v04/5fGqYBz2+ytSNyDGtRorWCqwIqFDF63H4g=='}]);
});

app.get('/instructions', function(req, res) {
    res.send([{message:'Try to find a secret API method.'}]);
});

app.get('/challenge', function(req, res) {
	res.send([{name:'Create a web application that takes in the following JSON as a POST request. Further instructions follow. E-mail the URL to <e-mail>.'}]);
});

app.listen(3000);
console.log('Listening on port 3000.');
