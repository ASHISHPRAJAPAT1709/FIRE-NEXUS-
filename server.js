require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Document = require('./models/Document');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer storage setup
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer file filter (only PDFs, images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

// Upload document API
app.post('/upload', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Invalid file type' });
        }
        const newDocument = new Document({ filename: req.file.filename, verified: false });
        await newDocument.save();
        res.json({ message: '✅ File uploaded successfully', file: newDocument });
    } catch (err) {
        res.status(500).json({ error: '❌ Error uploading file' });
    }
});

// Get all documents API
app.get('/documents', async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: '❌ Error fetching documents' });
    }
});

// Verify document API
app.put('/verify/:id', async (req, res) => {
    try {
        const updatedDoc = await Document.findByIdAndUpdate(
            req.params.id,
            { verified: true },
            { new: true } // Return updated document
        );
        if (!updatedDoc) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: '✅ Document verified', document: updatedDoc });
    } catch (err) {
        res.status(500).json({ error: '❌ Error verifying document' });
    }
});

// Serve admin panel by default
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
