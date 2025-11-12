import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./tcgconnect.db');
db.all('PRAGMA table_info(users);', (err, rows) => {
  if (err) console.error(err);
  else console.table(rows);
  db.close();
});
