function authorization(req, res, next) {
  const { apikey } = req.query;

  if (apikey === process.env.API_KEY) {
    next();

  } else {
    res.status(401);
    res.send('Api key is not recognized')
  }
}

function isAuthenticated(req, res, next) {
  // if (process.env.NODE_ENV === 'production') {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');

  // } else {
    next();
  // }
}

  module.exports = {
    authorization,
    isAuthenticated
  };
