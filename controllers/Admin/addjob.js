const Job = require('../../models/Job');
const Company = require('../../models/Company');
const redisClient = require('../../utils/redis');

const addJob = async (req, res) => {
    console.log(req.body);
  const { title, companyId, jobType, salary, urgency, location, description } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    await Job.create({
      title,
      companyId,
      jobType,
      salary,
      urgency,
      location,
      description,
    });

    const keys = await redisClient.keys('jobs:*');
    for (let key of keys) {
      await redisClient.del(key);
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error adding job:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addJob,
};
