/*global describe, it, before*/

var path = require('path');
var expect = require('chai').expect;

var app = require(path.resolve('config', 'app'));
var io = require('socket.io-client');

describe('WebSocket', function(){
  var socket, server, options = {transports: ['websocket'], 'force new connection': true};

  var createClient = function(){
    return io.connect('ws://localhost:' + server.address().port, options);
  };

  before(function(done){
    server = app.listen(done);
    socket = app.wsListen(server);
  });

  it('connectable', function (done){
    var client = createClient();
    client.once('disconnect', function(){
      done();
    });
    client.once('connect', function(){
      client.disconnect();
    });
  });

  it('increment visitor', function (done){
    var client = createClient();
    client.once('disconnect', function(){
      done();
    });
    client.once('visit', function(visit){
      expect(visit.count).to.equal(1);
      client.disconnect();
    });
  });

});
