const db = require('./database');
const Utils = require('./utils');

class Story {

  constructor(userId) {
    this.userId = userId;
  }
  static createTable() {
    return new Promise((resolve, reject) => {
      const query = `
        CREATE TABLE IF NOT EXISTS story (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          first_prompt TEXT NOT NULL,
          context TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES user(id)
        )
      `;
      db.connection.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        console.log("Story table created or already exists");
        resolve(results);
      });
    });
  }


  static create(userId, context, prompt) {
    return new Promise((resolve, reject) => {
      const updatedContext = prompt + context;
      const hexEncodedContext = Utils.hexEncodeText(updatedContext);
      const query = 'INSERT INTO story (user_id, first_prompt, context) VALUES (?, ?, ?)';
      db.connection.query(query, [userId, prompt, hexEncodedContext], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve({ insertId: results.insertId });
      });
    });
  }


  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM story WHERE id = ?';
      db.connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          const { id, userId, context } = results[0];
          const story = new Story(userId);
          story.id = id;
          story.context = context;
          resolve(story);
        } else {
          resolve(null);
        }
      });
    });
  }

  static getStoriesByUserId(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id AS storyId, first_prompt, created_at FROM story WHERE user_id  = ?';
      db.connection.query(query, [userId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }


  updateContext(prompt, newContext) {
    return new Promise((resolve, reject) => {
      const selectQuery = 'SELECT context FROM story WHERE id = ?';
      db.connection.query(selectQuery, [this.id], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return reject(new Error('Story not found'));
        }
        const currentContextHex = results[0].context;
        const currentContext = Utils.hexDecodeText(currentContextHex);
        const updatedContext = currentContext + "\n" + prompt + " " + newContext;
        const updatedContextHex = Utils.hexEncodeText(updatedContext);
        const updateQuery = 'UPDATE story SET context = ? WHERE id = ?';
        db.connection.query(updateQuery, [updatedContextHex, this.id], (err, results) => {
          if (err) {
            return reject(err);
          }
          this.context = updatedContext;
          resolve(results);
        });
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM story WHERE id = ?';
      db.connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  getContext(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT context FROM story WHERE id = ?';
      db.connection.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0].context);
      });
    });
  }

}

module.exports = Story;