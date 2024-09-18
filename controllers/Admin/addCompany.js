const Company = require('../../models/Company');
const redisClient = require('../../utils/redis'); 

const addCompany = async (req, res) => {
    console.log(req.body);
  const { name, location, logo } = req.body;

  try {
    await Company.create({
      name,
      location,
      logo,
    });

    const keys = await redisClient.keys('companies:*'); 
    for (let key of keys) {
      await redisClient.del(key);
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error adding company:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addCompany,
};
