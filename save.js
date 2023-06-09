const path = require("path");
const fs = require("fs");
const {
    glob,
    globSync,
    globStream,
    globStreamSync,
    Glob,
  } = require('glob')
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
        case "clone":
            cloneFile(req, res);
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
        let cpyPath = sanitizeFileName(file,true)
        let startTemplateUrl = req.body.startTemplateUrl;

        if (startTemplateUrl && startTemplateUrl != null) {
            
            let filePath = sanitizeFileName(startTemplateUrl)
            html = await fs.promises.readFile(filePath, { encoding: "utf8" });
        }
        else{
            cpyPath= sanitizeFileName(file,false)
        }
        let dirpath = path.dirname(cpyPath);
    
        console.log("dirpath", dirpath)
        if (!fs.existsSync(dirpath)) {
            fs.mkdirSync(dirpath, { recursive: true, mode: "777" });
        }
        fs.writeFile(cpyPath, html, { flag: "w" }, function (err) {
            if (err) {
                res.send({ error: err.message });
            }
            editor()
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
        let newPath = sanitizeFileName(newfile)
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                res.send({ error: err.message });
            } else {
                editor()
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
                editor()
                res.send({ message: "file deleted" });
            }
        });
    } catch (error) {
        res.send({ error: err.message });
    }
};

function sanitizeFileName(file, folder) {
    let dirpath=__dirname
    if(folder){
        dirpath=path.join(__dirname,"project")
    }
    // sanitize, remove double dot .. and remove get parameters if any
    file = path.join(dirpath, '/', file.replace(/\?.*$/, '').replace(/\.{2,}/g, '').replace(/[^\/\\a-zA-Z0-9\-\._]/g, ''));
  
    // allow only .html extension

    return file;
  }

  const cloneFile = async (req, res) => {
    try {
        let file = req.body.file;
        let newfile = req.body.newfile;
        let oldPath = sanitizeFileName(file)
        let newPath = sanitizeFileName(newfile)
        fs.copyFile(oldPath, newPath, (err) => {
            if (err) {
                res.send({ error: err.message });
            } else {
                editor()
                res.send({ message: "file copied" });
            }
        });
    } catch (error) {
        res.send({ error: err.message });
    }
};



 
const editor=async ()=>{
    fs.readFile('sample.html', 'utf8', (err, html) => {
        if (err) {
          return err

        }
        else {
            // search for html files in demo and my-pages folders
            const htmlFiles = [  ...glob.sync('demo/*.html'),
            ...glob.sync('demo/**/*.html'),
                ...glob.sync('project/**/*.html'),
                ...glob.sync('project/*.html'),
              
               
            ];
       

            let files = '';
            htmlFiles.forEach(file => {
                if (['new-page-blank-template.html', 'editor.html'].includes(file)) return; // Skip template files
                
                const pathInfo = path.parse(file);
                let { name, dir: folder, base: filename } = pathInfo;
          
                folder = folder.replace(/\/.+?$/, '');
                const subfolder = folder.replace(/^.+?\//, '');
                
                if (filename === 'index' && subfolder) {
                  filename = subfolder;
                }
                
                const url = path.join(pathInfo.dir, pathInfo.base);
               let temp=path.basename(pathInfo.dir)
             
                const title = temp.charAt(0).toUpperCase() + temp.slice(1);
           
                let filetemp= path.basename(url);
                files += `{name: '${title}', file: '${url}', title: '${filetemp}', url: '${url}', folder: '${temp}'},`;
              });

              files=files.replaceAll("\\", "/")
              
              // Replace the 'pages' placeholder in the HTML with the dynamic file list
              const modifiedHtml = html.replace('(pages);', `([${files}]);`);
          
             let res=fs.writeFileSync('editor.html',modifiedHtml)
                return res;
        }
    });
} 
module.exports = {
    save
}