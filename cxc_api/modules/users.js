const db = require('./database');
const jwt = require('jsonwebtoken');

class Users {
  constructor() {
    if (!Users.instance) {
      Users.instance = this;
    }

    return Users.instance;
  }

  createTable() {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS user (
          id INT AUTO_INCREMENT PRIMARY KEY,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          role ENUM('admin', 'user') DEFAULT 'user',
          call_count INT DEFAULT 0,
          recovery_question VARCHAR(255) NOT NULL,
          recovery_answer VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      db.connection.query(query, async (err, results) => {
        if (err) {
          return reject(err);
        }
        console.log('Users table created or already exists');
        try {
          await this.seedTable();
          resolve();
        } catch (seedErr) {
          reject(seedErr);
        }
      });
    });
  }

  seedTable() {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO user (email, password, role, recovery_question, recovery_answer) VALUES ?';
      const values = [
        ['john@john.com', '123', 'user', 'What is your pet\'s name?', 'Fluffy'],
        ['admin@admin.com', '111', 'admin', 'What is your mother\'s maiden name?', 'Potato']
      ];
      db.connection.query(query, [values], (err, results) => {
        if (err) {
          return reject(err);
        }
        console.log('Users table seeded');
        resolve(results);
      });
    });
  }


insert(email, password, recovery_question, recovery_answer) {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO user (email, password, recovery_question, recovery_answer) VALUES (?, ?, ?, ?)';
    db.connection.query(query, [email, password, recovery_question, recovery_answer], (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return reject(new Error('Email already exists'));
        }
        return reject(err);
      }
      resolve(results);
    });
  });
}

  login(email, password) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM user WHERE email = ? AND password = ?';
      db.connection.query(query, [email, password], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          const user = results[0];
          const token = this.generateJWT(user);
          resolve({ email: user.email, token });
        } else {
          reject(new Error('Invalid email or password'));
        }
      });
    });
  }

  getRecoveryQuestion(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT recovery_question FROM user WHERE email = ?';
      db.connection.query(query, [email], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(results[0].recovery_question);
        } else {
          reject(new Error('Email not found'));
        }
      });
    });
  }

  verifyRecoveryAnswer(email, answer) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id, recovery_answer FROM user WHERE email = ?';
      db.connection.query(query, [email], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0 && results[0].recovery_answer === answer) {
          const token = this.generateResetToken({ id: results[0].id, email });
          resolve({ isValid: true, token });
        } else {
          console.log('results:', results);
          console.log('answer:', answer);
          console.log('results[0].recovery_answer:', results[0].recovery_answer);
          resolve({ isValid: false });
        }
      });
    });
  }

  resetPassword(email, newPassword) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE user SET password = ? WHERE email = ?';
      db.connection.query(query, [newPassword, email], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  generateJWT(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const options = { expiresIn: '1h' };
    return jwt.sign(payload, secret, options);
  }

  generateResetToken(payload) {
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const options = { expiresIn: '5m' };
    return jwt.sign(payload, secret, options);
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT email, role FROM user';
      db.connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}

const instance = new Users();
Object.freeze(instance);

module.exports = instance;