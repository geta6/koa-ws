/*global describe, it*/

var path = require('path');

var app = require(path.resolve('config', 'app'));
var request = require('supertest').agent(app.listen());

describe('Routing', function(){
  it('should redirects', function(done){
    request.get('/').expect(200).end(done);
  });
});
