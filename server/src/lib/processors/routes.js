const router = require('express').Router();
const Processors = require('./processors');

router.get('/processors', async (req, res, next) => {
  try {
    const processors = await Processors.getAll()
    res.json(processors)

  } catch (err) {
    next(err)
  }
});

router.get('/processors/metrics', async (req, res, next) => {
  try {
    const { start, end } = req.query;

    if (!start) {
      res.status(400).end()
    }

    const metrics = await Processors.sortedBalancesPerProcessorInRange(start, end);
    res.json(metrics);

  } catch (err) {
    next(err)
  }
})

router.get('/processors/types', async (req, res, next) => {
  try {
    const processorTypes = await Processors.getProcessorTypes()
    res.json(processorTypes)

  } catch (err) {
    next(err)
  }
});

router.post('/processors', async (req, res, next) => {
  try {
    const { name, url, processorType } = req.body;
    await Processors.save(name, url, processorType);
    res.end();

  } catch (err) {
    next(err)
  }
});

router.patch('/processors/:id', async (req, res, next) => {
  try {
    const data = req.body;
    const { id } = req.params;

    await Processors.update(id, data);
    res.end();

  } catch (err) {
    next(err)
  }
})

router.patch('/processors/:id/enabled', async (req, res, next) => {
  try {
    const { enabled } = req.body;
    const { id } = req.params;

    await Processors.setEnabled(id, enabled);
    res.end();

  } catch (err) {
    next(err)
  }
})

router.delete('/processors/:id', async (req, res, next) => {
  try {
    await Processors.remove(req.params.id);
    res.end();

  } catch (err) {
    next(err)
  }
})

module.exports = router;
