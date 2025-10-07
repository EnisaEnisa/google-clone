const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Folder za upload
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

// Konfiguracija Multer-a
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Static folder za frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Ruta za upload više fajlova
app.post('/upload', upload.array('files', 20), (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).send('No files uploaded.');
    const filenames = req.files.map(f => f.filename);
    res.send(`Files uploaded successfully: ${filenames.join(', ')}`);
});

// Ruta za prikaz svih fajlova u uploads
app.get('/files', (req, res) => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) return res.status(500).send('Unable to scan files.');
        res.json(files);
    });
});

// Pokreni server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
function openModalFile(fileSrc) {
    modal.style.display = 'flex';
    modal.innerHTML = '<span class="close">&times;</span>'; // dodaj close dugme

    if(fileSrc.match(/\.(jpeg|jpg|gif|png)$/i)) {
        // slike
        const img = document.createElement('img');
        img.src = fileSrc;
        img.style.transform = 'scale(5)';
        modal.appendChild(img);
    } else if(fileSrc.match(/\.(pdf)$/i)) {
        // PDF
        const iframe = document.createElement('iframe');
        iframe.src = fileSrc;
        iframe.style.width = '80vw';
        iframe.style.height = '80vh';
        modal.appendChild(iframe);
    } else {
        // drugi fajlovi
        const link = document.createElement('a');
        link.href = fileSrc;
        link.download = fileSrc.split('/').pop();
        link.textContent = 'Download File';
        modal.appendChild(link);
    }

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => modal.style.display='none');
    modal.appendChild(closeBtn);
}
container.addEventListener('click', (e) => {
    e.stopPropagation();
    openModalFile(downloadLink.href); // uzmi URL fajla
});
