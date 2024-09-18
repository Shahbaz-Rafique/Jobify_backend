const Company = require('../../models/Company');
const redisClient = require('../../utils/redis');

exports.getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `companies:${page}:${limit}`;
    const cachedCompanies = await redisClient.get(cacheKey);

    if (cachedCompanies) {
      return res.status(200).json(JSON.parse(cachedCompanies));
    }

    const [companies, total] = await Promise.all([
      Company.find().skip(skip).limit(limit),
      Company.countDocuments()
    ]);
    const response = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      companies
    };
    await redisClient.set(cacheKey, JSON.stringify(response), 'EX', 3600); 

    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
