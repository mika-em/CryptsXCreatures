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

router.get("/admin/users", verifyJWT, checkAdminRole, async (req, res) => {
  try {
    const results = await users.getAllUsers();
    res.json(results);
  } catch (err) {
    console.error("Error retrieving users:", err);
    res.status(500).send("Server error");
  }
});

router.post('/logout', (req, res) => {
  Utils.invalidateCookie(res, 'token');
  res.status(200).send('Logged out successfully.');
});


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

app.use(`/${apiPath}`, router);

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
