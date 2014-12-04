# koa-ws

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
