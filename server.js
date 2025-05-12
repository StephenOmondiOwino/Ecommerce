const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Helper: Load and save users
const loadUsers = () => {
  if (!fs.existsSync('users.json')) return [];
  return JSON.parse(fs.readFileSync('users.json'));
};

const saveUsers = (users) => {
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Route: Sign Up
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const users = loadUsers();

  if (users.find(u => u.email === email)) {
    return res.send('<h3>User already exists. <a href="/signup.html">Try again</a></h3>');
  }

  users.push({ name, email, password });
  saveUsers(users);
  res.send('<h3>Account created! <a href="/login.html">Log in</a></h3>');
});

// Route: Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.redirect('/books.html');
  } else {
    res.send('<h3>Invalid credentials. <a href="/login.html">Try again</a></h3>');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
