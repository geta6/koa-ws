# koa-ws

  [![Circle CI](https://circleci.com/gh/geta6/koa-ws/tree/master.svg?style=svg)](https://circleci.com/gh/geta6/koa-ws/tree/master)

  must be running ***node 0.11.9*** or higher for generator support.

  must run node/mocha with the `--harmony` flag.

  avoid to use AltJS due to poorness of generator function support.


## requirements

  - node.js `^0.11.9`
  - redis


## run

  `npm i` and run with `npm start`


## env

  touch a file `.env` in the root of the project.


### acceptable env

  - `NODE_ENV` ... fallback to development default
  - `PORT` ... port for http/websocket
  - `REDISTOGO_URL` ... url for redis, url will be parsed


## test

  run `npm test`
