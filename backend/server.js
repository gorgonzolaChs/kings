var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var path = require('path');
var colors = require('colors');
var clear = require('clear');

/* Static serve everything */
app.use(express.static(path.join(__dirname, '../frontend')))

/* clients */
var connection = require('./connection')

io.on('connection', socket => connection.connect( socket, io) )

/* Start server */
clear()
http.listen(3000, () => console.log('\n\n\nKings Server open'.green));
