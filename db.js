const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./notlar.db');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY, title TEXT, content TEXT)");
});

function getAllNotes(callback) {
  db.all("SELECT * FROM notes", function(err, rows) {
    callback(err, rows);
  });
}

function addNote(title, content, callback) {
  db.run("INSERT INTO notes (title, content) VALUES (?, ?)", [title, content], callback);
}

function deleteNote(id, callback) {
  db.run("DELETE FROM notes WHERE id = ?", [id], callback);
}
// db.js içerisinde

// Diğer fonksiyon tanımlarınızın altına bu fonksiyonu ekleyin
function getNoteById(id, callback) {
    db.get("SELECT * FROM notes WHERE id = ?", [id], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}


function searchNotesByTitle(title, callback) {
    const sql = "SELECT * FROM notes WHERE title LIKE ?";
    db.all(sql, [`%${title}%`], (err, rows) => {
        callback(err, rows);
    });
}
function updateNote(id, title, content, callback) {
    const sql = "UPDATE notes SET title = ?, content = ? WHERE id = ?";
    db.run(sql, [title, content, id], callback);
}

// Fonksiyonu dışa aktar
module.exports = { getAllNotes, addNote, deleteNote, getNoteById, searchNotesByTitle, updateNote };
