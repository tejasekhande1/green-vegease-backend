const sqlite3 = require('sqlite3').verbose();

const DB_PATH = process.env.DB_PATH;

let db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

module.exports = db;