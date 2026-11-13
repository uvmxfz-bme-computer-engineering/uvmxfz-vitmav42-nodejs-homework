/**
 * Creates middleware that accepts a single product image upload.
 *
 * Files are stored in the "uploads" directory (served at "/uploads") and
 * only image mime types are accepted. The generated file name is exposed as
 * `req.file.filename` so handlers can persist it as the product imageUrl.
 *
 * @param {object} objects Shared product model or repository.
 * @returns {Function} Multer middleware for the "image" form field.
 */
const fs = require('node:fs');
const path = require('node:path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
const IMAGE_EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const extension = IMAGE_EXTENSIONS[file.mimetype];
        const name = `${Date.now()}-${Math.round(Math.random() * 1e3)}`;
        cb(null, name + extension);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (IMAGE_EXTENSIONS[file.mimetype]) {
            return cb(null, true);
        }
        const error = new Error('Only JPEG, PNG or WebP images are allowed.');
        error.status = 400;
        cb(error);
    },
});

module.exports = (objects) => upload.single('image');
