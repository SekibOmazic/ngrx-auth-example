var jsonServer = require('json-server');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwtToken = require('jsonwebtoken');
var config = require('./config');



function generateToken(email, password) {
  var payload = { email: email, password:password };
  return jwtToken.sign(payload, config.token.secret, {
    expiresIn: config.token.expires
  });
}

function extractToken(header) {
  return header.split(' ')[1];
}

// Returns an Express server
var server = jsonServer.create();

// Returns an Express router
var router = jsonServer.router('./server/db.json');
var db = router.db; // See lowdb on GitHub for documentation if needed


// Set default middlewares (logger, static, cors and no-cache)
server.use(jsonServer.defaults());
server.use(bodyParser.json());

server.use(jwt({
  secret: config.token.secret
}).unless(function(req) {
  var url = req.originalUrl;
  //console.log('URL', url);
  var usersRE = /^\/users(.*)?$/;

  return (
    url === '/signup' ||
    url === '/login'
    || (usersRE).test(url)
  );
}));

server.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  const user = db('users').find({ email: email });

  if (user !== undefined && user.password === password) {
    const token = generateToken(email, password);
    res.send({token: token, user: {id: user.id, name: user.name, email: user.email}, error: null});
  } else {
    res.send({token: null, user: null, error: 'No such user'});
    //res.sendStatus(404);
  }
});

server.post('/signup', function (req, res) {
  // is the email already taken
  const user = db('users').find({ email: req.body.email });

  console.log('/signup found', user);
  if (user === undefined ) {

    // Returns a Promise that resolves to an user
    userId = db('users').insert(req.body).id;
    const token = generateToken(req.body.email, req.body.password);
    res.send({token: token, user: {id: userId, name: req.body.name, email: req.body.email}, error: null});
  } else {
    res.send({token: null, user: null, error: 'Email already taken'});
    //res.sendStatus(404);
  }
});

server.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});


server.use(router);
server.listen(3100);
