const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    type: String, 
    required: false,
  },
}, {
  timestamps: true, 
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
