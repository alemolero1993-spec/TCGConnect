import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';

const NEW_PW = 'TCGConnect123!'; // contraseña temporal
const USER_ID = 'alemo';
const EMAIL = 'alemo@example.com';
const NAME = 'Alemo';

const db = new sqlite3.Database('./tcgconnect.db');

const hashed = bcrypt.hashSync(NEW_PW, 10);

db.serialize(() => {
  // Intentar actualizar usuario existente
  db.run('UPDATE users SET password = ? WHERE id = ?', [hashed, USER_ID], function(err) {
    if (err) {
      console.error('UPDATE error:', err);
      process.exit(1);
    }
    if (this.changes && this.changes > 0) {
      console.log(✅ Contraseña actualizada para id=''. Puedes iniciar sesión con el email ''.);
      console.log(Contraseña temporal: );
      db.close();
    } else {
      // si no existe, insertamos un nuevo registro con ese id
      db.run('INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)', [USER_ID, EMAIL, NAME, hashed], function(insErr) {
        if (insErr) {
          console.error('INSERT error:', insErr);
          process.exit(1);
        }
        console.log(✅ Usuario creado: id='', email=''.);
        console.log(Contraseña temporal: );
        db.close();
      });
    }
  });
});
