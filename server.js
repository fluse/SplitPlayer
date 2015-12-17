var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/example/player.html'));
});

app.use('/dist', express.static('dist'));
app.use('/', express.static('example'));

app.listen((typeof process.env.PORT !== 'undefined') ? process.env.PORT : 4711);
