const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db');

let rootPath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
const commonDirName = 'SidUpload';
const uploadDir = path.join(rootPath, commonDirName);

router.post('/upload', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Unable to scan directory:', err);
            return res.status(500).send('Unable to scan directory');
        }

        files.forEach(file => {
            let uploadPath = path.join(uploadDir, file);

            let sql = 'INSERT INTO files (name, path) VALUES (?, ?)';
            db.query(sql, [file, uploadPath], (err, result) => {
                if (err) {
                    console.error('Database insert error:', err);
                    return res.status(500).send('Failed to save file metadata.');
                }
            });
        });

        res.send('Files uploaded and metadata saved!');
    });
});

router.get('/folder', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Unable to scan directory:', err);
            return res.status(500).send('Unable to scan directory');
        }
        res.json({ files });
    });
});

module.exports = router;
