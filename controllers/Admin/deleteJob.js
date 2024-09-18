const Job = require('../../models/Job');
const redisClient = require('../../utils/redis');

exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.query; 

    const result = await Job.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const keys = await redisClient.keys('jobs:*');
    for (let key of keys) {
      await redisClient.del(key);
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
