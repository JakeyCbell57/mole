const router = require('express').Router();
const Users = require('./users');

router.get('/users', async (req, res, next) => {
  console.log('hello')
  try {
    const users = await Users.getAll()
    console.log(users)
    res.json(users)
    
  } catch (err) {
    next(err)
  }
});

router.post('/users', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await Users.save(username, password)
    res.end();
    
  } catch (err) {
    next(err)
  }
})

router.delete('/users/:id', async (req, res, next) => {
  try {
    await Users.remove(req.params.id);
    res.end();

  } catch (err) {
    next(err)
  }
})

module.exports = router;
