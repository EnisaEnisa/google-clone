const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

// Folder za upload
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if(!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Upload endpoint
app.post('/upload', upload.array('files'), (req, res) => {
    const files = req.files.map(f => f.filename);
    res.send('Files uploaded successfully: ' + files.join(', '));
});

// Endpoint za listu fajlova
app.get('/files', (req, res) => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if(err) return res.status(500).json([]);
        res.json(files);
    });
});

// Serviranje uploadovanih fajlova
app.use('/uploads', express.static(UPLOADS_DIR));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
