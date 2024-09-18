const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'], 
    trim: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
  },
  salary: {
    type: String, 
    required: [true, 'Salary is required'],
    trim: true, 
  },
  urgency: {
    type: String,
    required: [true, 'Urgency is required'],
    enum: ['Low', 'Medium', 'High'], 
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
  },
}, {
  timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
