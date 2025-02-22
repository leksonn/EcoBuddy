// Import necessary modules
const express = require('express');
const cors = require('cors');

// Initialize the app
const app = express();
const port = 3000;

// Use middleware
app.use(cors());
app.use(express.json());

// Simple route to get data
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:4200`);
});
