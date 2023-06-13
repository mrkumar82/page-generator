const path = require("path");
const fs = require("fs");
const {
    glob,
    globSync,
    globStream,
    globStreamSync,
    Glob,
  } = require('glob')

const editor = async (req, res) => {
    try {

       res.send({"message":true})
    }
    catch (err) {
        res.send(("message", err.message));
    }
}

module.exports={
    editor
}