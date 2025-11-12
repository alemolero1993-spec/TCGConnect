const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database('./tcgconnect.db');
const user = db.prepare('SELECT id,email,password FROM users WHERE email = ?').get('alemo@example.com');

console.log('USER_RECORD:', user ? { id: user.id, email: user.email, pw_preview: user.password ? user.password.slice(0,12) + '...' : null } : null);

if (!user) {
  console.error('Usuario no encontrado');
  process.exit(1);
}

bcrypt.compare('TCGConnect123!', user.password, (err, ok) => {
  if (err) {
    console.error('BCRYPT_ERROR', err);
    process.exit(1);
  }
  console.log('BCRYPT_COMPARE_RESULT:', ok);
  db.close();
});
