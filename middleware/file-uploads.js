const multer = require('multer');
const nodeid = require('node-id');

let uniqueId = nodeid();

const MINE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};
const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        const isValid = !!MINE_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mine type');
        cb(error, isValid);
    },
});

module.exports = fileUpload;
