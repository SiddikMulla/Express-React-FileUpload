const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const multer = require('multer');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Setup multer for file uploads
const upload = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            // Define a temporary directory for uploads
            const tempDir = path.join(__dirname, '../temp_uploads');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            cb(null, tempDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

// Route to set the user's directory
router.post('/set-directory', authenticateToken, (req, res) => {
    const { directoryPath } = req.body;

    if (!directoryPath) {
        return res.status(400).send('Directory path is required.');
    }

    const userId = req.user.id;
    const uploadDir = path.join(directoryPath, 'SidUpload'); // Create SidUpload directory

    // Ensure the SidUpload directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    db.query('UPDATE users SET folderPath = ? WHERE id = ?', [uploadDir, userId], (err) => {
        if (err) {
            console.error('Error updating folder path:', err);
            return res.status(500).send('Error updating folder path');
        }
        res.send(`Directory set to: ${uploadDir}`);
    });
});

// Route to upload files
router.post('/upload', authenticateToken, upload.array('files'), (req, res) => {
    const userId = req.user.id;

    db.query('SELECT folderPath FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving user folder path:', err);
            return res.status(500).send('Error retrieving user folder path');
        }

        const uploadDir = results[0]?.folderPath;
        if (!uploadDir) {
            return res.status(400).send('Upload directory is not set.');
        }

        const files = req.files || [];
        
        if (files.length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        files.forEach(file => {
            const finalPath = path.join(uploadDir, file.originalname); // Save file in the SidUpload directory

            fs.rename(file.path, finalPath, (err) => {
                if (err) {
                    console.error('Error moving file:', err);
                    return res.status(500).send('Error uploading file');
                }

                db.query('INSERT INTO files (name, path, userId) VALUES (?, ?, ?)', [file.originalname, finalPath, userId], (err) => {
                    if (err) {
                        console.error('Database insert error:', err);
                    }
                });
            });
        });

        res.send('Files uploaded and metadata saved!');
    });
});

// Route to get files in the user's folder
router.get('/folder', authenticateToken, (req, res) => {
    const userId = req.user.id;

    db.query('SELECT folderPath FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving user folder path:', err);
            return res.status(500).send('Error retrieving user folder path');
        }

        const uploadDir = results[0]?.folderPath;
        if (!uploadDir) {
            return res.status(400).send('Upload directory is not set.');
        }

        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error('Unable to scan directory:', err);
                return res.status(500).send('Unable to scan directory');
            }
            res.json({ files });
        });
    });
});

module.exports = router;
