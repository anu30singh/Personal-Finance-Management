require('dotenv').config();
const pool = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 4000;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://personal-finance-management-mhpj.onrender.com",
    ],
    credentials: true,
  })
);


(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('DB chl gya');

    require('./app'); 

  } catch (err) {
    console.error('DB connection phat gya', err);
  }
})();

app.listen(PORT);
