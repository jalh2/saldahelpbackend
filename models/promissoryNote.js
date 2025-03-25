const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const promissoryNoteSchema = new mongoose.Schema({
  noteDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  lender: {
    type: String,
    default: "SALDA HELP BY GOD INTERPRISE",
    required: true
  },
  borrower: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact1: { type: String, required: true },
    contact2: { type: String }
  },
  loanDetails: {
    amountLRD: { type: Number, required: true },
    amountUSD: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    paymentPeriod: { type: String, required: true }, // e.g., "6 months", "1 year"
    paymentStartDate: { type: Date, required: true },
    paymentEndDate: { type: Date, required: true }
  },
  guarantor: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact1: { type: String, required: true },
    contact2: { type: String },
    relationshipToBorrower: { type: String, required: true }
  },
  witnesses: [{
    name: { type: String, required: true },
    contact: { type: String, required: true }
  }],
  loanOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'defaulted'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add timestamps for tracking updates
promissoryNoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Setup encryption (you'll need to set these secret keys in your .env file)
const encKey = process.env.ENCRYPTION_KEY;
const sigKey = process.env.SIGNING_KEY;

// Fields to encrypt
promissoryNoteSchema.plugin(encrypt, {
  encryptionKey: encKey,
  signingKey: sigKey,
  encryptedFields: ['borrower', 'guarantor', 'witnesses']
});

const PromissoryNote = mongoose.model('PromissoryNote', promissoryNoteSchema);

module.exports = PromissoryNote;
