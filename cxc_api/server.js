const Utils = require("./modules/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const apiPath = Utils.apiPath;
const db = require('./modules/database');
const users = require('./modules/users');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const StoryGenerator = require('./modules/storyGenerator');
const Story = require('./modules/story');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501', 'https://www.cryptsxcreatures.com'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const router = express.Router();


const verifyJWT = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token.");
    }
    req.user = decoded;
    next();
  });
};


const checkAdminRole = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send("Access denied. Admins only.");
  }
};

router.get("/", (req, res) => {
  res.send("Welcome!");
});

router.get('/verifyjwt', verifyJWT, (req, res) => {
  res.send('Welcome!');
});

/**
* @swagger 
* /register:
*   post:
*     summary: Register a new user
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*               password:
*                 type: string
*               recovery_question:
*                 type: string
*               recovery_answer:
*                 type: string
*     responses:
*       201:
*         description: User registered successfully
*       409:
*         description: Email already exists
*       500:
*         description: Server error
*/
router.post("/register", async (req, res) => {
  const { email, password, recovery_question, recovery_answer } = req.body;
  try {
    await users.insert(email, password, recovery_question, recovery_answer);
    res.status(201).send("User registered successfully");
  } catch (err) {
    if (err.message === "Email already exists") {
      res.status(409).send("Email already exists");
    } else {
      console.error("Error registering user:", err);
      res.status(500).send("Server error");
    }
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Login a user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { email: userEmail, role, token } = await users.login(email, password);
    Utils.setCookie(res, "token", token);
    res.json({ email: userEmail, role });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(401).send("Invalid email or password");
  }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users (admin only).
 *     parameters:
 *       - in: header
 *         name: Cookie
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     responses:
 *       200:
 *         description: Successful retrieval of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   call_count:
 *                     type: integer
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get("/admin/users", verifyJWT, checkAdminRole, async (req, res) => {
  try {
    const results = await users.getAllUsers();
    res.json(results);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("Server error");
  }
});
router.get("/admin/users", verifyJWT, checkAdminRole, async (req, res) => {
  try {
    const results = await users.getAllUsers();
    res.json(results);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("Server error");
  }
});

/**
* @swagger
* /logout:
*   post:
*     summary: Logout
*     description: Invalidate the JWT token.
*     responses:
*       200:
*         description: Logged out successfully
*/
router.post('/logout', (req, res) => {
  Utils.invalidateCookie(res, 'token');
  res.status(200).send('Logged out successfully.');
});

/**
* @swagger
* /forgotpassword:
*   get:
*     summary: Get recovery question
*     description: Retrieve the recovery question for a user.
*     parameters:
*       - in: query
*         name: email
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Successful retrieval of recovery question
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 question:
*                   type: string
*       500:
*         description: Server error
 */
router.get('/forgotpassword', async (req, res) => {
  const { email } = req.query;
  try {
    const question = await users.getRecoveryQuestion(email);
    res.json({ question });
  } catch (err) {
    console.error("Error retrieving recovery question:", err);
    res.status(500).send("Server error");
  }
});

/**
* @swagger
* /verifyanswer:
*   post:
*     summary: Verify recovery answer
*     description: Verify the recovery answer for a user.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*               answer:
*                 type: string
*     responses:
*       200:
*         description: Answer verified
*       401:
*         description: Invalid answer
*       500:
*         description: Server error
 */
router.post("/verifyanswer", async (req, res) => {
  const { email, answer } = req.body;
  try {
    const { isValid, token } = await users.verifyRecoveryAnswer(email, answer);
    if (isValid) {
      Utils.setCookie(res, "resetToken", token);
      res.json({
        message: "Answer verified. You can now reset your password.",
      });
    } else {
      res.status(401).send("Invalid answer.");
    }
  } catch (err) {
    console.error("Error verifying recovery answer:", err);
    res.status(500).send("Server error");
  }
});

const verifyResetToken = (req, res, next) => {
  const token = req.cookies.resetToken;
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret",
    (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid token.");
      }
      req.user = decoded;
      next();
    },
  );
};

/**
* @swagger
* /resetpassword:
*   post:
*     summary: Reset password
*     description: Reset the password for the user.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*               newPassword:
*                 type: string
*     responses:
*       200:
*         description: Password reset successfully
*       500:
*         description: Server error
 */
router.post("/resetpassword", verifyResetToken, async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    await users.resetPassword(email, newPassword);
    Utils.invalidateCookie(res, "resetToken");
    res.status(200).send("Password reset successfully.");
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).send("Server error");
  }
});

/**
* @swagger
* /generate:
*   post:
*     summary: Generate a story
*     description: Generate a story based on a prompt.
*     parameters:
*       - in: cookie
*         name: token
*         required: true
*         schema:
*           type: string
*         description: JWT token
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               prompt:
*                 type: string
*               storyId:
*                 type: integer
*     responses:
*       200:
*         description: Successful generation of story
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 storyId:
*                   type: integer
*                 response_plain_text:
*                   type: string
*                 callCount:
*                   type: integer
*       500:
*         description: Server error
 */
router.post('/generate', verifyJWT, async (req, res) => {
  const { prompt, storyId } = req.body;
  const userId = req.user.id;
  try {
    const story = await StoryGenerator.generateStory(prompt, userId, storyId);
    res.json(story);
  } catch (err) {
    console.error('Error generating story:', err);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get user stories
 *     description: Retrieve stories for the authenticated user.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     responses:
 *       200:
 *         description: Successful retrieval of stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   storyId:
 *                     type: integer
 *                   first_prompt:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get('/stories', verifyJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const stories = await Story.getStoriesByUserId(userId);
    res.json(stories);
  } catch (err) {
    console.error('Error retrieving stories:', err);
    res.status(500).send('Server error');
  }
});

router.post('/voicegenerate', verifyJWT, async (req, res) => {
  const { audio_file, storyId } = req.body;
  const userId = req.user.id;
  try {
    const story = await StoryGenerator.generateStoryFromAudio(audio_file, userId, storyId);
    res.json(story);
  } catch (err) {
    console.error('Error retrieving stories:', err);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /callcount:
 *   get:
 *     summary: Get call count
 *     description: Retrieve the call count for the authenticated user.
 *     parameters:
 *       - in: cookie
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token
 *     responses:
 *       200:
 *         description: Successful retrieval of call count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 callCount:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/callcount', verifyJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const count = await users.getCallCount(userId);
    res.json({ callCount: count });
  } catch (err) {
    console.error('Error retrieving call count:', err);
    res.status(500).send('Server error');
  }
});

app.use(`/${apiPath}`, router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


(async () => {
  try {
    await db.connect();
    const dbExists = await db.checkDatabase(process.env.DB_NAME);
    if (dbExists) {
      console.log("Database exists");
      const userTableExists = await db.checkTable(process.env.DB_NAME, "user");
      if (!userTableExists) {
        await users.createTable();
      }
      const storyTableExists = await db.checkTable(process.env.DB_NAME, "story");
      if (!storyTableExists) {
        await Story.createTable();
      }
      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/${apiPath}`);
      });
    } else {
      console.error("Database does not exist");
    }
  } catch (err) {
    console.error("Error:", err);
  }
})();

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await db.close();
  process.exit();
});
