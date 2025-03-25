const PromissoryNote = require('../models/promissoryNote');
const User = require('../models/user');

// Create a new promissory note
exports.createNote = async (req, res) => {
  try {
    // Check if the loan officer exists and is an employee
    const loanOfficer = await User.findById(req.body.loanOfficer);
    if (!loanOfficer || loanOfficer.role !== 'employee') {
      return res.status(400).json({ message: 'Invalid loan officer' });
    }

    const note = new PromissoryNote(req.body);
    const savedNote = await note.save();
    
    // Populate the loan officer details
    await savedNote.populate('loanOfficer', 'username role');
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all promissory notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await PromissoryNote.find()
      .populate('loanOfficer', 'username role');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single promissory note by ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await PromissoryNote.findById(req.params.id)
      .populate('loanOfficer', 'username role');
    if (!note) {
      return res.status(404).json({ message: 'Promissory note not found' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a promissory note
exports.updateNote = async (req, res) => {
  try {
    // If updating loan officer, verify the new one exists and is an employee
    if (req.body.loanOfficer) {
      const loanOfficer = await User.findById(req.body.loanOfficer);
      if (!loanOfficer || loanOfficer.role !== 'employee') {
        return res.status(400).json({ message: 'Invalid loan officer' });
      }
    }

    const note = await PromissoryNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Promissory note not found' });
    }

    const updatedNote = await PromissoryNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('loanOfficer', 'username role');
    
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a promissory note
exports.deleteNote = async (req, res) => {
  try {
    const note = await PromissoryNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Promissory note not found' });
    }

    await PromissoryNote.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Promissory note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search promissory notes
exports.searchNotes = async (req, res) => {
  try {
    const query = {};
    if (req.query.borrowerName) {
      query['borrower.name'] = { $regex: req.query.borrowerName, $options: 'i' };
    }
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.startDate && req.query.endDate) {
      query.noteDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    if (req.query.loanOfficer) {
      query.loanOfficer = req.query.loanOfficer;
    }

    const notes = await PromissoryNote.find(query)
      .populate('loanOfficer', 'username role');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
