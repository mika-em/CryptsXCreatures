const mysql = require("mysql");

class Database {
  constructor() {
    if (!Database.instance) {
      this.connection = mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
      });
      Database.instance = this;
    }

    return Database.instance;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          return reject(err);
        }
        console.log("Connected to MySQL");
        resolve();
      });
    });
  }

  checkDatabase(dbName) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?";
      this.connection.query(query, [dbName], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  checkTable(dbName, tableName) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?";
      this.connection.query(query, [dbName, tableName], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  createDatabase(dbName) {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
      });

      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          return reject(err);
        }

        const query = `CREATE DATABASE ${dbName}`;
        connection.query(query, (err, results) => {
          connection.end();
          if (err) {
            return reject(err);
          }
          console.log(`Database ${dbName} created`);
          resolve();
        });
      });
    });
  }

  ensureDatabaseAndTable(dbName, tableName, createTableCallback) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.connect();
        const dbExists = await this.checkDatabase(dbName);
        if (!dbExists) {
          console.log(`Database ${dbName} does not exist, creating...`);
          await this.createDatabase(dbName);
          await this.close();
          this.connection = mysql.createConnection({
            host: process.env.DB_HOST || "127.0.0.1",
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: dbName,
          });
          await this.connect();
        }
        const tableExists = await this.checkTable(dbName, tableName);
        if (!tableExists) {
          await createTableCallback();
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) {
          console.error("Error closing MySQL connection:", err);
          return reject(err);
        }
        console.log("MySQL connection closed");
        resolve();
      });
    });
  }
}

const instance = new Database();
Object.freeze(instance);

module.exports = instance;
