#!/usr/bin/env node --harmony

var path = require('path');
var dotenv = require('dotenv');

dotenv.load();

var app = require(path.resolve('config', 'app'));

var server = app.listen(process.env.PORT || 3000, function(){
  console.log('start listening on port ' + server.address().port);
});

app.wsListen(server);
