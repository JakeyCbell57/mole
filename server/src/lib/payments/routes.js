const router = require('express').Router();
const { clients } = require('../clients');
const loadBalancer = require('./loadBalancer');

router.post('/payment', async (req, res, next) => {
  const token = req.get('Authorization');

  if (!token) {
    return res.status(401).end();
  }

  let client;

  try {
    client = await clients.getByClientKey(req.body.clientKey);

  } catch (err) {
    return next('Something went wrong...');
  }

  if (!client) {
    return res.status(404).end();

  } else if ('Bearer ' + client.clientSecret !== token || !client.enabled) {
    return res.status(401).end();
  }

  try {
    const order = await loadBalancer.processOrder(req.body, client);
    return res.json(order);

  } catch (err) {
    if (err.status === 503) {
      return res.status(503).json(err);
    }
    return next(err);
  }
});

module.exports = router;
