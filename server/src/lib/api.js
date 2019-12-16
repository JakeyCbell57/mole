const router = require('express').Router();

const users = require('./users');
const clients = require('./clients');
const processors = require('./processors');
const payments = require('./payments');
const orders = require('./orders')

router.use('/', users.routes);
router.use('/', clients.routes);
router.use('/', processors.routes);
router.use('/', payments.routes);
router.use('/', orders.routes);

module.exports = router;
