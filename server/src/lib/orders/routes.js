const router = require('express').Router();
const Orders = require('./orders');

router.get('/orders', async (req, res, next) => {
  try {
    const { start, end } = req.query;

    if(!start) {
      res.status(400).end()
    }

    const query = end ? Orders.getAllInRange : Orders.getAllSince;

    const orders = await query(start, end);
    res.json(orders);
    
  } catch (err) {
    next(err)
  }
});

module.exports = router;
