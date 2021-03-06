var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/example/multi.html'));
});

app.use('/dist', express.static('dist'));
app.use('/', express.static('example'));

var port = (typeof process.env.PORT !== 'undefined') ? process.env.PORT : 4711;
app.listen(port);

console.log('serving on port %s', port);
