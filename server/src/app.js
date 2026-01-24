const express = require('express');
const cors = require('cors');
const usersRoutes = require('./modules/users/users.routes');
const authRoutes = require('./modules/auth/auth.routes');
const testRoutes = require("./routes/test");
const walletRoutes = require("./routes/wallet");
const transactionRoutes = require("./routes/transactions");
const dashboardRoutes = require("./routes/dashboard");
const goalRoutes = require("./routes/goals");





const app = express(); 

app.use(cors());
app.use(express.json());



app.use('/users', usersRoutes); // Mount users routes
app.use('/auth', authRoutes); // Mount auth routes
app.use("/test", testRoutes); // Mount test routes
app.use("/wallet", walletRoutes); // Mount wallet routes
app.use("/transactions", transactionRoutes); // Mount transaction routes
app.use("/dashboard", dashboardRoutes); // Mount dashboard routes
app.use("/goals", goalRoutes); // Mount goals routes
app.use("/reports", require("./routes/reports")); // Mount reports routes //directly requiring here for brevity
app.use("/ai", require("./routes/ai")); // Mount AI routes




app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app; 
