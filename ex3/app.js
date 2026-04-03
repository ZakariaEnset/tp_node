const http = require('http');
const fs = require('fs');
const path = require('path');


const PORT = 3000;
const PUBLIC_FOLDER_PATH = path.join(__dirname, 'public');


const serveur = http.createServer(async (req, res) => {
    const { method, url } = req;


    // Helper pour répondre en JSON
    const repondre = (code, data) => {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
    };

    try {
        if (method == 'GET') {
            const ext = path.extname(url);
            let contentType = "";
            if (url != "/" && fs.existsSync(path.join(PUBLIC_FOLDER_PATH, url))) {
                let content = fs.readFileSync(path.join(PUBLIC_FOLDER_PATH, url));
                switch (ext) {
                    case '.html':
                        contentType = 'text/html'
                        break;
                    case '.css':
                        contentType = 'text/css'
                        break;
                    case '.js':
                        contentType = 'application/javascript'
                        break;
                }
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            } 
            else if(url  == '/' || url == ''){
                let content = fs.readFileSync(path.join(PUBLIC_FOLDER_PATH, 'index.html'));
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end("<h1>File not found !");
            }
        }

    } catch (err) {
        repondre(500, { erreur: err.message });
    }


})

serveur.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});