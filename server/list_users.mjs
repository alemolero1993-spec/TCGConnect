import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./tcgconnect.db');
db.all("SELECT id, email, name FROM users;", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.table(rows);
    db.close();
  }
});
