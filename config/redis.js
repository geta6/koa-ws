if (process.env.REDISTOGO_URL) {
  var rtg = require('url').parse(process.env.REDISTOGO_URL);
  var client = require('redis').createClient(rtg.port, rtg.hostname);
  if (rtg.auth) {
    client.auth(rtg.auth.split(':')[1]);
  }
} else {
  var client = require('redis').createClient();
}

exports = module.exports = {
  search: function (query) {
    return function* () {
      var keys = yield module.exports.keys(query);
      for (var i = 0; i < keys.length; i++) {
        keys[i] = yield module.exports.hgetall(keys[i]);
      }
      return keys;
    };
  },
  keys: function(str) {
    return function (callback) {
      client.keys(str, callback);
    };
  },
  hmset: function(key, object) {
    return function (callback) {
      client.hmset(key, object, callback);
    };
  },
  hgetall: function (key) {
    return function (callback) {
      client.hgetall(key, callback);
    };
  }
};
