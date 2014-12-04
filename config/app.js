// DEPENDENCIES
var co = require('co');
var path = require('path');
var wait = require('co-wait');
var debug = require('debug')('app');

var redis = require(path.resolve('config', 'redis'));
var koa = require(path.resolve('config', 'koa'));


// APPLICATION
var app = koa();


// MIDDLEWARES
if (process.env.NODE_ENV !== 'test') app.use(require('koa-logger')());
app.use(require('koa-static')(path.resolve('public')));
app.use(require('koa-views')(path.resolve('views'), {
  default: 'jade',
  cache: process.env.NODE_ENV === 'production'
}));

// RENDER
app.use(function*(){
  yield this.render('index');
});


// HELPER
var visit = 0;
var prefix = 'track:';

var play = co.wrap(function*(guid){
  var track = yield redis.hgetall(prefix + guid);
  if (!track) track = { guid: guid, play: 0 };
  track.play = parseInt(track.play, 10) + 1;
  if (track.play < 0) track.play = 0;
  yield redis.hmset('track:' + guid, track);
  debug('+track: ' + track.play);
  return track;
});

var stop = co.wrap(function*(guid){
  var track = yield redis.hgetall(prefix + guid);
  if (!track) track = { guid: guid, play: 1 };
  track.play = parseInt(track.play, 10) - 1;
  if (track.play < 0) track.play = 0;
  yield redis.hmset(prefix + guid, track);
  debug('-track: ' + track.play);
  return track;
});

// WEBSOCKETS
app.ws('connection', function*(){
  visit++;
  debug('+visit: ' + visit);
  this.socket.playing = false;
  this.sockets.emit('visit', { visitor: null, count: visit });
  this.socket.emit('tracks', yield redis.search(prefix + '*'));
});

app.ws('disconnect', function*(){
  if (--visit < 0) visit = 0;
  debug('-visit: ' + visit);
  if (this.socket.playing) {
    this.sockets.emit('track', yield stop(this.socket.playing));
    this.socket.playing = false;
  }
});

app.ws('track', function*(){
  this.sockets.emit('track', yield play(this.param.guid));
  this.socket.playing = this.param.guid;
  yield wait(15 * 1000);
  this.sockets.emit('track', yield stop(this.param.guid));
});

app.ws('tracks', function*(){
  var tracks = yield redis.search(prefix + '*');
  for (var i = tracks.length - 1; 0 <= i; i--) {
    if (tracks[i].play === 0) {
      tracks.splice(i, 1);
    }
  }
  this.socket.emit('tracks', tracks);
});


exports = module.exports = app;
