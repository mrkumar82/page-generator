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

        fs.readFile('editor.html', 'utf8', (err, html) => {
            if (err) {
                res.send(("message", err.message));

            }
            else {
                // search for html files in demo and my-pages folders
                const htmlFiles = [
                    ...glob.sync('project/*.html'),
                    ...glob.sync('demo/**/*.html'),
                    ...glob.sync('demo/*.html')
                ];
                console.log(htmlFiles)

                let files = '';
                htmlFiles.forEach(file => {
                    if (['new-page-blank-template.html', 'editor.html'].includes(file)) return; // Skip template files
                    
                    const pathInfo = path.parse(file);
                    let { name, dir: folder, base: filename } = pathInfo;
                    console.log(pathInfo)
                    folder = folder.replace(/\/.+?$/, '');
                    const subfolder = folder.replace(/^.+?\//, '');
                    
                    if (filename === 'index' && subfolder) {
                      filename = subfolder;
                    }
                    
                    const url = path.join(folder, pathInfo.base);
                   let temp=folder.split("\\");
               
                    const title = temp[temp.length-1].charAt(0).toUpperCase() + temp[temp.length-1].slice(1);
                  
                    let filetemp= path.join((path.dirname(file)+'\\'),path.basename(file));
                    files += `{name: '${title}', file: '${filetemp}', title: '${title}', url: '${url}', folder: '${url.split("\\")[0]}'},`;
                  });

                  files=files.replaceAll("\\", "/")
                  
                  // Replace the 'pages' placeholder in the HTML with the dynamic file list
                  const modifiedHtml = html.replace('(pages);', `([${files}]);`);;
                  
              //    console.log(modifiedHtml);
               
                // replace files list from html with the dynamic list from demo folder
              
                
                res.send(modifiedHtml)
            }
        });
    }
    catch (err) {
        res.send(("message", err.message));
    }
}

module.exports={
    editor
}