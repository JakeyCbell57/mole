const router = require('express').Router();
const { clients } = require('../clients');
const loadBalancer = require('./loadBalancer');

router.post('/payment', async (req, res, next) => {
  const header = req.get('Authorization');
  const token = header && header.replace('Bearer ', '');

  if (!token) {
    res.status(401).end();
  }

  let client;

  try {
    client = await clients.getById(req.body.clientId);

  } catch (err) {
    next('Something went wrong...');
  }

  if (!client) {
    res.status(404).end();

  } else if (client.apiKey !== token) {
    res.status(401).end();
  }

  try {
    const order = await loadBalancer.processOrder(req.body);
    res.json(order);

  } catch (err) {
    if (err.status === 503) {
      res.status(503).json(err);
    }
    next(err);
  }
});

module.exports = router;
