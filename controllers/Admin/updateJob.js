const Job = require('../../models/Job');
const redisClient = require('../../utils/redis');

exports.updateJob = async (req, res) => {
  try {
    const { id } = req.query; 
    const { jobTitle, jobType, salary, urgency, location, jobDescription } = req.body;

    if (!jobTitle || !jobType || !salary || !location) {
      return res.status(400).json({ message: 'Job title, job type, salary, and location are required' });
    }
    const existingJob = await Job.findById(id);
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id, 
      { jobTitle, jobType, salary, urgency, location, jobDescription }, 
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job update failed' });
    }

    const keys = await redisClient.keys('jobs:*');
    for (let key of keys) {
      await redisClient.del(key);
    }

    res.status(200).json({ message: 'Job updated successfully', data: updatedJob });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
