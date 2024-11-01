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
          email VARCHAR(255) NOT NULL,
          role ENUM('admin', 'user') DEFAULT 'user',
          call_count INT DEFAULT 0,
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
      const query = 'INSERT INTO user (email, password, role) VALUES ?';
      const values = [
        ['john@john.com', '123', 'user'],
        ['admin@admin.com', '111', 'admin']
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


  insert(email, password) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO user (email, password) VALUES (?, ?)';
      db.connection.query(query, [password, email], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve();
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
          resolve({ token });
        } else {
          reject(new Error('Invalid email or password'));
        }
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


  getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM user';
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