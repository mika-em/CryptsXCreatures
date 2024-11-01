const Utils = require('./modules/utils');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const apiPath = Utils.apiPath;
const db = require('./modules/database');
const users = require('./modules/users');

app.use(express.json());

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome!');
});

router.get('/users', async (req, res) => {
  try {
    const results = await users.getAllUsers();
    res.json(results);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).send('Server error');
  }
});

app.use(`/${apiPath}`, router);

(async () => {
  try {
    await db.connect();
    const dbExists = await db.checkDatabase(process.env.DB_NAME);
    if (dbExists) {
      console.log('Database exists');
      const tableExists = await db.checkTable(process.env.DB_NAME, 'user');
      if (!tableExists) {
        await users.createTable();
      }
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/${apiPath}`);
      });
    } else {
      console.error('Database does not exist');
    }
  } catch (err) {
    console.error('Error:', err);
  }
})();

process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await db.close();
  process.exit();
});
