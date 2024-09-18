const User = require('../../models/users');
const redisClient = require('../../utils/redis');

exports.getAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const cacheKey = `admins:${page}:${limit}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    } else {
        const admins = await User.find({ role: 'admin' })
        .skip(skip)
        .limit(limit)
        .lean();

        const totalAdmins = await User.countDocuments({ role: 'admin' });

        const responseData = {
        data: admins,
        total: totalAdmins,
        page,
        totalPages: Math.ceil(totalAdmins / limit),
        };


        await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));

        res.status(200).json(responseData);
    }
  } catch (err) {
    console.error('Error fetching admins:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

