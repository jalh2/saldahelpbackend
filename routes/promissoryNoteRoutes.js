const express = require('express');
const router = express.Router();
const promissoryNoteController = require('../controllers/promissoryNoteController');

// Create a new promissory note
router.post('/', promissoryNoteController.createNote);

// Get all promissory notes
router.get('/', promissoryNoteController.getAllNotes);

// Search promissory notes
router.get('/search', promissoryNoteController.searchNotes);

// Get a specific promissory note
router.get('/:id', promissoryNoteController.getNoteById);

// Update a promissory note
router.put('/:id', promissoryNoteController.updateNote);

// Delete a promissory note
router.delete('/:id', promissoryNoteController.deleteNote);

module.exports = router;
