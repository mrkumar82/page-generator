
const multer = require("multer")
const fs = require("fs")
const path = require('path')
const util = require("util")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname)
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname.replace(/\?.*$/, '').replace(/\.{2,}/g, '').replace(/[^\/\\a-zA-Z0-9\-\._]/g, ''))
  }
})

const fileFilter = (req, file, cb) => {
  let ext = path.extname(file.originalname)

  let allowedExt = ['.ico', '.jpg', '.jpeg', '.png', '.gif', '.webp']

  if (allowedExt.includes(ext.toLowerCase())) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only ico, jpg, jpeg, png, gif, webp format allowed!'));
  }
};

let fileUploadToServer = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter: fileFilter
});

module.exports = { fileUploadToServer }
