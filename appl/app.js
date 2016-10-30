
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', function(req,res){
	res.render('index');
});

app.post('/add',bodyParser.json(), function(req,res){
	var a = req.body.a;
	var b = req.body.b;
	
	var sum = a + b;
	
	res.json(sum);
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(process.env.PORT || 1337);