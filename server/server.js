// if (process.env.NODE_ENV === 'development') {
require('dotenv').config()
// }

// require('./src/schedule');
// require('./src/telegram');

const express = require('express');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressRateLimiter = require('express-rate-limit');
const RateLimitRedis = require('rate-limit-redis');
const redis = require('redis');
const { authorization, isAuthenticated } = require('./src/middleware/middleware');
const orders = require('./src/orders');
const auth = require('./src/lib/auth');
const apiRoutes = require('./src/lib/api')

const server = express();
const PORT = process.env.PORT;
const minutes = (num = 1) => num * 60 * 1000;
// const kraken = require('./src/lib/exchanges/Kraken/kraken_exchange')

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  server.use(morgan('dev'));
}

//rate limit only in production
if (process.env.NODE_ENV === 'production') {
  const client = redis.createClient({ url: process.env.REDIS_URL });

  const rateLimiter = expressRateLimiter({
    store: new RateLimitRedis({ client }),
    windowMS: minutes(1),
    max: 2000
  });

  server.set('trust proxy', '127.0.0.1');
  server.use(rateLimiter);
}

server.use(cors({
  origin: true,
  credentials: true
}))

server.use(bodyParser.json());
server.use('/static', express.static(path.resolve('../client/build')));
server.use('/login-page', express.static(path.resolve('../client/login')));

server.post('/report', authorization, async (req, res, next) => {
  try {
    const data = req.body;

    await orders.storeIfNotExist(data);
    res.end();

  } catch (error) {
    next(error);
  }
});

server.get('/login', (req, res) => res.sendFile('index.html', { root: '../client/login' }));

const SessionOptions = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 10
  }
};


server.use('/api', apiRoutes);

server.use(session(SessionOptions));
server.use(auth.passport.initialize());
server.use(auth.passport.session());

server.use(auth.routes);

if (process.env.NODE_ENV === 'production') {
  server.use('/*', isAuthenticated, (req, res) => {
    res.sendFile('index.html', { root: '../client/build' });
  });
}

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
