const router = require('express').Router();
const bodyParser = require('body-parser');
const authentication = require('./authentication');
const { isAuthenticated } = require('../../middleware/middleware');

router.use(bodyParser.urlencoded({ extended: true }))
router.post('/auth/login', authentication.passport.authenticate('local', { failureRedirect: '/login?err=1' }), authentication.login);
router.post('/auth/register', authentication.register);
router.post('/auth/logout', isAuthenticated, authentication.logout);

module.exports = router;
