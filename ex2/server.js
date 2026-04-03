const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const FICHIER = path.join(__dirname, 'notes.json');

async function lireNotes() {
    try {
        const data = await fs.readFile(FICHIER, 'utf8');
        return JSON.parse(data);
    } catch { return []; }
}

// Lire le body d'une requête POST
function lireBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => resolve(JSON.parse(body || '{}')));
    });
}

const serveur = http.createServer(async (req, res) => {
    const { method, url } = req;

    // Helper pour répondre en JSON
    const repondre = (code, data) => {
        res.writeHead(code, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
    };

    try {
        // TODO : GET / → { message: 'API Notes', version: '1.0' }
        if (method == 'GET' && url == '/') {
            return repondre(200, { "message": "API Notes", "version": "1.0" });
        }
        // TODO : GET /notes → tableau des notes depuis le fichier
        if (method == 'GET' && url == '/notes') {
            let notes = await lireNotes();
            return repondre(200, { notes });
        }
        // TODO : POST /notes
        // 1. Lire le body avec lireBody(req)
        // 2. Vérifier que body.texte existe (sinon 400)
        // 3. Lire les notes, ajouter la nouvelle, sauvegarder
        // 4. Répondre 201 avec la note créée
        if (method == 'POST' && url == '/notes') {
            await lireBody(req).then(async data => {
                if (data.texte != null || data.texte != '') {

                    let notes = await lireNotes();
                    notes.push(data);

                    await fs.writeFile(FICHIER, JSON.stringify(notes, null, 2), 'utf-8');

                    return repondre(201,  "La note créee" );
                }
                repondre(400,  "BAD REQUEST" ); 
            });
        }

        // TODO : GET /heure → { heure: new Date().toLocaleTimeString('fr-FR') }
        if (method == 'GET' && url == '/heure') {
            return repondre(200, { heure: new Date().toLocaleTimeString('fr-FR') });
        }

        // TODO : Route par défaut → 404 { erreur: 'Route non trouvée' }
        return repondre(404, { erreur: 'Route non trouvée' });

    } catch (err) {
        repondre(500, { erreur: err.message });
    }
});

serveur.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});