const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../users/users');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await Users.getByUsername(username);

      if (!user) {
        return cb(null, false);
      }

      const valid = bcrypt.compareSync(password, user.password);

      if(valid) {
        await Users.updateLastLogin(user.userId);
        return cb(null, user);

      } else {
        return cb(null, false);
      }

    } catch (err) {
      return cb(err);
    }
  }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

function login(req, res) {
  res.redirect('/?username=' + req.user.username);
}

function logout(req, res) {
  if (process.env.NODE_ENV === 'production') {
    req.session.destroy(req.sessionId, () => {
      req.logout();
    });
  } else {
    req.logout();
  }
  res.redirect('/login');
}

async function register(req, res, next) {
  const { username, password, key } = req.body;

  try {
    if(key === process.env.REGISTRATION_KEY) {
      await Users.save(username, password);
      res.redirect('/login?success=1');

    } else {
      res.redirect('/register?err=3');
    }

  } catch (err) {
    next(err)
  }
}

module.exports = {
  passport,
  login,
  logout,
  register
}
