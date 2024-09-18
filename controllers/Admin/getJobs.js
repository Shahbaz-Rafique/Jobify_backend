const Job = require('../../models/Job');
const redisClient = require('../../utils/redis');

exports.getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `jobs:${page}:${limit}`;
    const cachedJobs = await redisClient.get(cacheKey);

    if (cachedJobs) {
      return res.status(200).json(JSON.parse(cachedJobs));
    }

    const [jobs, total] = await Promise.all([
      Job.find()
        .skip(skip)
        .limit(limit)
        .populate('companyId') 
        .exec(),
      Job.countDocuments(),
    ]);

    const response = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      jobs,
    };

    await redisClient.set(cacheKey, JSON.stringify(response), 'EX', 3600);
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
