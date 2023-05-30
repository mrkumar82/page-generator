const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const formData = require("express-form-data");
var bodyParser = require("body-parser");

const { fileUploadToServer } = require("./upload");
const { save } = require("./save")
const { scan } = require("./scan")
const { editor } = require('./editor')


const app = express();
let rootpath = "";

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/editor.html");
});

app.use("/", express.static(path.join(__dirname, "")));
app.post("/save", save);

app.get("/scan", scan);

app.post("/upload", fileUploadToServer.single("file"), async (req, res) => {
  try {
    let mediaPath = req.body.mediaPath;
    let fileName = req.file.filename;
    let filePath = req.file.path;
    if (mediaPath) {
      const newPath = path.join(__dirname, mediaPath, fileName);
      const dirPath = path.dirname(newPath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true, mode: "777" });
      }
      fs.copyFile(filePath, newPath, (error) => {
        if (error) {
          res.send(("ERROR", error.message));
        } else {
          fs.unlinkSync(filePath);
          res.send({
            message: path.basename(newPath),
          });
        }
      });
    } else {
      res.send({
        message: filePath.replace(__dirname, "").replaceAll("\\", "/"),
      });
    }
  } catch (error) {

    res.send(("message", error.message));
  }
});

app.get('/editor', editor)

app.listen(3000, () => {
  console.log("server running in port 3000");
});





