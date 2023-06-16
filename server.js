const express = require('express');
const path = require('path');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON request bodies
app.use(express.json());

// Expense routes
app.use('/expenses', expenseRoutes);

// Handle root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
