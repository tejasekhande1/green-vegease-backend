import sqlite3 from 'sqlite3';

const DB_PATH = process.env.DB_PATH || ':memory:';

console.log(DB_PATH);

let db = new sqlite3.Database(DB_PATH, (err: Error | null) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

export default db;