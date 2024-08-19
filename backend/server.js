const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const db = require('./db');
const fileRoutes = require('./routes/fileRoutes');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

let rootPath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;


const commonDirName = 'SidUpload';

const uploadDir = path.join(rootPath, commonDirName);


if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
