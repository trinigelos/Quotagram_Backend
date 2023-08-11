// models/FormData.js
const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // Add more fields as needed
}, { timestamps: true });

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
