const fs = require('fs').promises;
const path = require('path');

const FICHIER = path.join(__dirname, 'notes.json');

// Lire toutes les notes depuis le fichier JSON
async function lireNotes() {
    const contents = await fs.readFile(FICHIER, { encoding: 'utf-8' })
        .then((data => {
            return JSON.parse(data);
        })).catch(err => {
            if (err.code === 'ENOENT') {
                console.log(FICHIER, ' Not found')
                return [];
            }
        });
    return contents;
}

// Ajouter une note
async function ajouterNote(texte) {
    if (texte.trim() == '') {
        return;
    }

    let notes = await lireNotes();

    const note = {
        id: notes.length + 1,
        text: texte.trim(),
        date: new Date().toISOString()
    }

    notes.push(note)

    await fs.writeFile(FICHIER, JSON.stringify(notes, null, 2), 'utf-8');

    console.log("Note ajoutée : " + texte);
}

// Lister toutes les notes
async function listerNotes() {
    let notes = await lireNotes();
    if (notes.length == 0) {
        console.log('Aucune note')
    } else {
        notes.forEach(note => {
            console.log(`#${note.id} - ${note.text} (${note.date})`);
        });
    }
}

// Supprimer une note par ID
async function supprimerNote(id) {
    // TODO : lire les notes
    // TODO : filtrer pour exclure la note avec l'id donné (parseInt(id))
    // TODO : si la longueur n'a pas changé, afficher "Note introuvable"
    // TODO : sinon, sauvegarder et afficher "Note supprimée"

    let notes = await lireNotes();
    newNotes = notes.filter(note => note.id != parseInt(id));
    if (notes.length != newNotes.length) {
        await fs.writeFile(FICHIER, JSON.stringify(newNotes, null, 2), 'utf-8');
        console.log('Note supprimée')
    }
    else {
        console.log('Note introuvable');
    }
}

// Point d'entrée — lire les arguments : node notes.js  [args]
async function main() {
    const [commande, ...args] = process.argv.slice(2);

    switch (commande) {
        case 'add': await ajouterNote(args.join(' ')); break;
        case 'list': await listerNotes(); break;
        case 'delete': await supprimerNote(args[0]); break;
        default:
            console.log('Usage: node notes.js add ');
            console.log(' node notes.js list');
            console.log(' node notes.js delete ');
    }
}

main().catch(console.error);