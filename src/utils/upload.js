'use strict';

const path = require(`path`);
const fsFromises = require(`fs`).promises;
const multer = require(`multer`);

const validExtensions = [`.png`, `.jpg`, `.jpeg`];

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

const userImgUpload = upload.single(`avatar`);

const addFile = (req, data) => {
  if (req.file) {
    data.file = req.file;
  }
};

const saveFile = async (req, pathPrefix, assignFieldsNames) => {
  if (req.body.file) {
    const {file} = req.body;
    const backendFilePath = `${pathPrefix}/${file.filename}`;
    await fsFromises.rename(file.path, path.join(process.cwd(), `./src/frontend/public/${backendFilePath}`));
    delete req.body.file;
    assignFieldsNames.forEach((fieldName) => {
      req.body[fieldName] = backendFilePath;
    });
  }
};


module.exports = {
  articleImgUpload,
  userImgUpload,
  validExtensions,
  addFile,
  saveFile,
};
