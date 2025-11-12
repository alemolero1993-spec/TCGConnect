const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const NEW_PW = 'TCGConnect123!';
const USER_ID = 'alemo';

const db = new Database('./tcgconnect.db');

const hashed = bcrypt.hashSync(NEW_PW, 10);

const info = db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, USER_ID);
console.log('UPDATE_INFO:', info);

const user = db.prepare('SELECT id, email, password FROM users WHERE id = ?').get(USER_ID);
console.log('USER_RECORD:', user ? { id: user.id, email: user.email, pw_preview: user.password ? user.password.slice(0,12) + '...' : null } : null);

const ok = bcrypt.compareSync(NEW_PW, user.password);
console.log('BCRYPT_COMPARE_RESULT_SYNC:', ok);

db.close();
