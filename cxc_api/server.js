const Utils = require('./modules/utils');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const apiPath = Utils.apiPath;
const db = require('./modules/database');
const users = require('./modules/users');
const jwt = require('jsonwebtoken');

app.use(express.json());

const corsOptions = {
  origin: '*', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

const router = express.Router();

// Middleware to verify JWT
const verifyJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token.');
    }
    req.user = decoded;
    next();
  });
};


router.get('/', verifyJWT, (req, res) => {
  res.send('Welcome!');
});

router.post('/register', async (req, res) => {
  const { email, password, recovery_question, recovery_answer } = req.body;
  try {
    await users.insert(password, email, recovery_question, recovery_answer);
    res.status(201).send('User registered successfully');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Server error');
  }
});;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await users.login(email, password);
    res.json({ email, token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(401).send('Invalid email or password');
  }
});

router.get('/forgotpassword', async (req, res) => {
  const { email } = req.query;
  try {
    const question = await users.getRecoveryQuestion(email);
    res.json({ question });
  } catch (err) {
    console.error('Error retrieving recovery question:', err);
    res.status(500).send('Server error');
  }
});

router.post('/verifyanswer', async (req, res) => {
  const { email, answer } = req.body;
  try {
    const { isValid, token } = await users.verifyRecoveryAnswer(email, answer);
    if (isValid) {
      res.json({ message: 'Answer verified. You can now reset your password.', token });
    } else {
      res.status(401).send(`Invalid answer.${isValid}`);
    }
  } catch (err) {
    console.error('Error verifying recovery answer:', err);
    res.status(500).send('Server error');
  }
});

const verifyResetToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token.');
    }
    req.user = decoded;
    next();
  });
};


router.post('/resetpassword', verifyResetToken, async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    await users.resetPassword(email, newPassword);
    res.status(200).send('Password reset successfully.');
  } catch (err) {
    console.error('Error resetting password:', err);
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
