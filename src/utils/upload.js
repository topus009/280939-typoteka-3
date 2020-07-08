'use strict';

const path = require(`path`);
const multer = require(`multer`);

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const upload = multer({storage});

const postImgUpload = upload.single(`img`);

module.exports = {
  postImgUpload,
};
