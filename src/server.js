const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// Set up file storage using Multer
const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage }); // Limit the file size (optional but good for debugging)
const uploadLimit = 2 * 1024 * 1024; // 2MB max file size

// Set file size limit for Multer
const uploadWithLimit = multer({
  storage,
  limits: { fileSize: uploadLimit },  // Add limit to avoid huge files crashing your server
}).single('image');

// Middleware to parse JSON bodies
app.use(express.json());

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Malea',
  password: 'Malea123',
  database: 'Malea',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// Serve the static React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Create a new route to serve data to the front-end
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM yourtable'; // Ensure this table exists

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error in the query: ', error);
      res.status(500).send('Server error');
      return;
    }

    const modifiedResults = results.map((row) => ({
      design: row.Design,
      color: row.Color,
      size: row.Size,
      price: row.Price,
      image: row.image
        ? `data:image/jpeg;base64,${row.image.toString('base64')}`
        : null,
    }));

    res.json(modifiedResults); // Send data as JSON
  });
});

// POST route for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const query = 'SELECT * FROM login WHERE username = ?';
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const user = results[0];

    // Check if the provided password matches the stored password (in plain text)
    if (password === user.password) {
      return res.json({ success: true, role: user.role, message: 'Login successful.' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
  });
});

// Simple /add route to handle form data + image upload
app.post('/add', uploadWithLimit, (req, res) => {
  // Multer validation (if no image is uploaded)
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const { design, color, size, price } = req.body;
  const image = req.file; // Multer stores the uploaded file in req.file

  if (!design || !color || !size || !price || !image) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert the data into the database
  const query = 'INSERT INTO yourtable (Design, Color, Size, Price, Image) VALUES (?, ?, ?, ?, ?)';
  const imageBuffer = image.buffer; // Multer stores the image in a buffer

  connection.query(query, [design, color, size, price, imageBuffer], (error, results) => {
    if (error) {
      console.error('Error in the insert query: ', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
    res.status(201).json({ message: 'Item added successfully', id: results.insertId });
  });
});

// DELETE Route to remove an item based on its 'design'
app.delete('/delete/:design', (req, res) => {
  const { design } = req.params;

  // Check if 'design' is provided in the request params
  if (!design) {
    return res.status(400).json({ message: 'Design name is required' });
  }

  // SQL query to delete the record by the 'design' name
  const query = 'DELETE FROM yourtable WHERE Design = ?';  // Replace 'yourtable' with your actual table name

  // Execute the query to delete the record
  connection.query(query, [design], (error, results) => {
    if (error) {
      console.error('Error in the delete query: ', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Design not found' });
    }

    res.status(200).json({ message: 'Design deleted successfully' });
  });
});

// POST route for sign-up (without bcrypt)
app.post('/sign-up', (req, res) => {
  const { username, password, isAdmin } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if user already exists
  const query = 'SELECT * FROM login WHERE username = ?';
  connection.query(query, [username], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    // Store user data in the database (password is stored as plain text here)
    const insertQuery = 'INSERT INTO login (username, password, role) VALUES (?, ?, ?)';
    connection.query(insertQuery, [username, password, isAdmin ? 'admin' : 'customer'], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to create user', error: err.message });
      }

      res.status(201).json({ message: 'Signup successful!' });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});