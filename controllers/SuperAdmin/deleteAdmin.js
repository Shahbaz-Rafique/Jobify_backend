const User = require('../../models/users');
const redisClient = require('../../utils/redis'); 

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.query; 

    const result = await User.deleteOne({ _id: id });

    const keys = await redisClient.keys('admins:*'); 
    for (let key of keys) {
      await redisClient.del(key);
    }

    return res.status(200).json({ message: 'success' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
