const path = require("path");
const fs = require("fs");

const save= async (req, res) => {
    let action = req.query.action;
    if (action) {
      switch (action) {
        case "rename":
          renameFile(req, res);
          break;
        case "delete":
          deleteFile(req, res);
          break;
        default:
          res.send({ message: "not a valid action" });
      }
    } else {
      saveFile(req, res);
    }
  }

const saveFile = async (req, res) => {
    try {
        let file = req.body.file;
        let html = req.body.html;
        let cpyPath = sanitizeFileName(file)
        let startTemplateUrl = req.body.startTemplateUrl;

        if (startTemplateUrl && startTemplateUrl != null) {
            let filePath = sanitizeFileName(startTemplateUrl)
            html = await fs.promises.readFile(filePath, { encoding: "utf8" });
        }
        let dirpath = path.dirname(cpyPath);
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true, mode: "777" });
        }
        fs.writeFile(cpyPath, html, { flag: "w" }, function (err) {
            if (err) {
                res.send({ error: err.message });
            }
            res.send({ message: "file saved" });
        });
    } catch (err) {
        res.send({ error: err.message });
    }
};

const renameFile = async (req, res) => {
    try {
        let file = req.body.file;
        let newfile = req.body.newfile;
        let oldPath = sanitizeFileName(file)
        let newPath = sanitizeFileName(newfile,false)
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                res.send({ error: err.message });
            } else {
                res.send({ message: "file renamed" });
            }
        });
    } catch (error) {
        res.send({ error: err.message });
    }
};

const deleteFile = async (req, res) => {
    try {
        let file = req.body.file;
        let filePath = sanitizeFileName(file)
        fs.unlink(filePath, (err) => {
            if (err) {
                res.send({ error: err.message });
            } else {
                res.send({ message: "file deleted" });
            }
        });
    } catch (error) {
        res.send({ error: err.message });
    }
};

function sanitizeFileName(file, allowedExtension = 'html') {
    // sanitize, remove double dot .. and remove get parameters if any
    file = path.join(__dirname, '/', file.replace(/\?.*$/, '').replace(/\.{2,}/g, '').replace(/[^\/\\a-zA-Z0-9\-\._]/g, ''));
  
    // allow only .html extension
    if (allowedExtension) {
      file = file.replace(/\..+$/, '') + `.${allowedExtension}`;
    }
    return file;
  }
module.exports = {
    save
}