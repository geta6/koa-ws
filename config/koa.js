var co = require('co');
var koa = require('koa');
var assert = require('assert');
var compose = require('koa-compose');
var socketio = require('socket.io');

var onerror = function(err){
  if (err) console.error(err);
};

koa.prototype.ws = function(event, fn) {
  assert(typeof event === 'string', 'app.ws requires string in first param');
  assert(fn.constructor.name === 'GeneratorFunction', 'app.ws requires a generator function in second param');

  if (!this.wsmw) this.wsmw = {};
  if (!this.wsmw[event]) this.wsmw[event] = [];
  this.wsmw[event].push(fn);

  return this;
};

koa.prototype.wsListen = function (server) {
  var wsmw = this.wsmw || {};
  var connection = null;
  var middlewares = [];

  Object.keys(wsmw).forEach(function(event) {
    if (event === 'connection') {
      connection = compose(wsmw.connection);
    } else {
      middlewares.push([event, compose(wsmw[event])]);
    }
  });

  if (!middlewares.length) throw new Error('there is no ws events.');

  var io = socketio.listen(server);

  io.sockets.on('connection', function(socket){
    if (connection) {
      co(connection.bind({sockets: io.sockets, socket: socket})).catch(onerror);
    }
    middlewares.forEach(function(middleware){
      socket.on(middleware[0], function(param){
        co(middleware[1].bind({sockets: io.sockets, socket: socket, param: param})).catch(onerror);
      });
    });
  });
};

exports = module.exports = koa;
