const Company = require('../../models/Company');
const redisClient = require('../../utils/redis'); 

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.query; 

    const result = await Company.deleteOne({ _id: id });

    const keys = await redisClient.keys('companies:*'); 
    for (let key of keys) {
      await redisClient.del(key);
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
