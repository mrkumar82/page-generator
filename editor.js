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
                    ...glob.sync('my-pages/*.html'),
                    ...glob.sync('demo/**/*.html'),
                    ...glob.sync('demo/*.html')
                ];

                let files = '';
                htmlFiles.forEach((file) => {
                    if (['new-page-blank-template.html', 'editor.html'].includes(file)) return; // skip template files
                    const pathInfo = path.parse(file);
                    let filename = pathInfo.name;
                    const folder = pathInfo.dir.replace(/\/.+?$/, '');
                    const subfolder = pathInfo.dir.replace(/^.+?\//, '');
                    if (filename === 'index' && subfolder) {
                        filename = subfolder;
                    }
                    const url = path.join(pathInfo.dir, pathInfo.base);
                    const name = filename.charAt(0).toUpperCase() + filename.slice(1);

                    files += `{name: '${name}', file: '${file}', title: '${name}', url: '${url}', folder: '${folder}'},`;
                });

                // replace files list from html with the dynamic list from demo folder
                html = html.replace('(pages);', `([${files}]);`);

                res.send(html)
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