const express = require('express');
const app = express();
const db = require('./db');
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  db.getAllNotes((err, notes) => {
    if (err) return res.send("Hata oluştu.");
    res.render('index', { notes });
  });
});

app.post('/add', (req, res) => {
  const { title, content } = req.body;
  db.addNote(title, content, (err) => {
    if (err) return res.send("Not eklenirken bir hata oluştu.");
    res.redirect('/');
  });
});

app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.deleteNote(id, (err) => {
    if (err) return res.send("Not silinirken bir hata oluştu.");
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});

app.get('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.getNoteById(id, (err, note) => {
        if (err || !note) {
            return res.send("Not bulunamadı veya bir hata oluştu.");
        }
        res.render('note', { note });
    });
});

// server.js dosyası içinde

app.get('/arama', (req, res) => {
    const { q } = req.query; // Arama sorgusunu al
    db.searchNotesByTitle(q, (err, notes) => {
        if (err) {
            return res.send("Arama sırasında bir hata oluştu.");
        }
        res.render('arama-sonuclari', { notes, searchQuery: q });
    });
});

app.post('/notes/update/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.updateNote(id, title, content, (err) => {
        if (err) {
            return res.send("Not güncellenirken bir hata oluştu.");
        }
        res.redirect('/notes/' + id); // Güncellenen notun detay sayfasına yönlendir
    });
});

app.get('/notes/edit/:id', (req, res) => {
    const { id } = req.params;
    db.getNoteById(id, (err, note) => {
        if (err || !note) {
            return res.send("Not bulunamadı veya bir hata oluştu.");
        }
        res.render('edit-note', { note });
    });
});