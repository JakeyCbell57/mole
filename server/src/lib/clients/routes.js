const router = require('express').Router();
const Clients = require('./clients');

router.get('/clients', async (req, res, next) => {
  try {
    const clients = await Clients.getAll()
    res.json(clients)

  } catch (err) {
    next(err)
  }
});

router.get('/clients/metrics', async (req, res, next) => {
  try {
    const { start, end } = req.query;

    if (!start) {
      res.status(400).end()
    }

    const metrics = await Clients.sortedBalancesPerClientInRange(start, end);
    res.json(metrics);

  } catch (err) {
    next(err)
  }
})

router.post('/clients', async (req, res, next) => {
  try {
    const { name } = req.body;
    await Clients.save(name)
    res.end();

  } catch (err) {
    next(err)
  }
})

router.patch('/clients/:id/enabled', async (req, res, next) => {
  try {
    const { enabled } = req.body;
    const { id } = req.params;

    await Clients.setEnabled(id, enabled);
    res.end();

  } catch (err) {
    next(err)
  }
})

router.patch('/clients/:id', async (req, res, next) => {
  try {
    const { name, url } = req.body;
    const { id } = req.params;

    await Clients.update(id, { name, url });
    res.end();

  } catch (err) {
    next(err)
  }
})

router.patch('/clients/:id/resetCredentials', async (req, res, next) => {
  try {
    const { id } = req.params;

    await Clients.resetCredentials(id);
    res.end();

  } catch (err) {
    next(err)
  }
})

router.post('/clients/:id/onboard', async (req, res, next) => {
  try {
    const { id } = req.params;

    const textfile = await Clients.getTextFile(id);
    const createFile = await Clients.createTextFile(textfile);
    const createZip = await Clients.createZipFile(createFile);

    res.end();

  } catch (err) {
    next(err)
  }
})



router.delete('/clients/:id', async (req, res, next) => {
  try {
    await Clients.remove(req.params.id);
    res.end();

  } catch (err) {
    next(err)
  }
})

module.exports = router;
