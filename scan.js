
const path = require("path");
const fs = require("fs");
let rootpath;

const scan = async (req, res) => {
    try {
      let mediaPath = req.body.mediaPath;
      if (!mediaPath) {
        mediaPath = "media";
      }
      let dirPath = path.join(__dirname, mediaPath);
      rootpath = dirPath;
      let files = await scanFiles(dirPath);
  
      res.send(files);
    } catch (error) {
      res.send({ error: error.message });
    }
  }


const scanFiles = async (dirPath) => {
    try {
        if (fs.lstatSync(dirPath).isDirectory()) {
            const files = await fs.promises.readdir(dirPath);
            let data = [];
            for (let file of files) {
                const filePath = path.join(dirPath, file);
                let item = await scanFiles(filePath);
                data.push(item);
            }
            let absPath = dirPath.replace(rootpath, "");

            return {
                name: path.basename(absPath),
                type: "folder",
                path: dirPath.replace(rootpath, "").replaceAll("\\", "/"),
                items: data,
            };
        } else {
            let stat = await fs.promises.stat(dirPath);
            return {
                name: path.basename(dirPath),
                type: "file",
                path: dirPath.replace(rootpath, "").replaceAll("\\", "/"),
                size: stat.size,
            };
        }
    } catch (error) {
        return error;
    }
};

module.exports = {
    scan
}