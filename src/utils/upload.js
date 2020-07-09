'use strict';

const path = require(`path`);
const multer = require(`multer`);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), `tmp`));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const upload = multer({storage});

const articleImgUpload = upload.single(`img`);

module.exports = {
  articleImgUpload,
};
