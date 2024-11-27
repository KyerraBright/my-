const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up Express app
const app = express();
const port = 5000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const hardcodedUsername = 'admin';
const hardcodedPassword = 'password123';

// MongoDB schema and model
const designSchema = new mongoose.Schema({
    design: { type: String, required: true },
    color: String,
    size: String,
    price: Number,
    image: String, // Path to the uploaded image
});

const Design = mongoose.model('Design', designSchema);

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose
    .connect('mongodb://localhost:27017/yourtable', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Endpoint to fetch data (for DesignTable component)
app.get('/data', async (req, res) => {
    try {
        const designs = await Design.find(); // Fetch all designs from the DB
        res.status(200).json(designs); // Send them as a JSON response
    } catch (error) {
        console.error('Error fetching designs:', error);
        res.status(500).json({ message: 'Failed to fetch designs' });
    }
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); // Create the directory if it doesn't exist
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({ storage });

// Endpoint to add a design with an image
app.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { design, color, size, price } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : ''; // Save relative path

        const newDesign = new Design({ design, color, size, price, image: imagePath });
        await newDesign.save();

        res.status(201).json({ message: 'Design added successfully!', design: newDesign });
    } catch (error) {
        console.error('Error adding design:', error);
        res.status(500).json({ message: 'Failed to add design.' });
    }
});
// Assuming you're using Express.js
// Endpoint to delete a design
app.delete('/delete', async (req, res) => {
    try {
        const { design } = req.query;  // Get the design name from the query parameters
        if (!design) {
            return res.status(400).send({ message: 'Design name is required' });
        }

        // Find and delete the design from the database
        const deletedDesign = await Design.findOneAndDelete({ design });

        if (!deletedDesign) {
            return res.status(404).send({ message: 'Design not found' });
        }

        res.send({ message: 'Design deleted successfully!' });
    } catch (error) {
        console.error('Error deleting:', error);
        res.status(500).send({ message: 'Failed to delete item. Please try again.' });
    }
});


// User Schema and Model
mongoose.connect('mongodb://localhost:27017/login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));
  
  // Login route
  app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === hardcodedUsername && password === hardcodedPassword) {
        // Assuming 'admin' role for the hardcoded user
        res.json({
            success: true,
            role: 'admin', // Set the role to 'admin' for this test user
            message: 'Login successful'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});
  app.post('/sign-up', async (req, res) => {
    const { username, password, isAdmin } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Create a new user
        const newUser = new User({ username, password, isAdmin });
        await newUser.save();

        res.status(201).json({ message: 'User signed up successfully' });
    } catch (err) {
        console.error('Sign-up error:', err);
        res.status(500).json({ message: 'Failed to sign up. Please try again.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
