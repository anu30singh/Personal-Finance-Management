require('dotenv').config();
const pool = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB chl gya');

    require('./app'); 
    console.log(` Server ready on port ${PORT}`);
  } catch (err) {
    console.error('DB connection phat gya', err);
  }
})();

app.listen(PORT);
