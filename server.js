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

// MongoDB schema and model
const designSchema = new mongoose.Schema({
    design: { type: String, required: true },
    color: String,
    size: String,
    price: Number,
    image: String, // Path to the uploaded image
});

const Design = mongoose.model('yourtable', designSchema);

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
