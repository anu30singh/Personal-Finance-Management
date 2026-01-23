const express = require('express');
const cors = require('cors');
const usersRoutes = require('./modules/users/users.routes');
const authRoutes = require('./modules/auth/auth.routes');

const app = express(); 

app.use(cors());
app.use(express.json());

// user routes
app.use('/users', usersRoutes);
app.use('/auth', authRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app; 
